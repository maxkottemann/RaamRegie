"use client";

import { SubPageHeader } from "@/components/headers/pageHeader";
import RoomError from "@/components/states/ErrorState";
import NotFoundState from "@/components/states/notFound";
import Button from "@/components/ui/buttons/Button";
import ItemSelector from "@/components/ui/hierarchies/itemSelector";
import RoomSelector from "@/components/ui/hierarchies/roomSelector";
import StorySelector from "@/components/ui/hierarchies/storySelector";
import AddModal from "@/components/ui/modals/addModal";
import DeleteModal from "@/components/ui/modals/DeleteModal.";
import EditModal from "@/components/ui/modals/EditModal";
import { useToast } from "@/context/ToastContext";
import { useDeleteItem, useItemsFromRoom } from "@/hooks/itemHooks";
import { useLocationWithClient } from "@/hooks/locationHooks";
import { useCreateRoom, useDeleteRoom, useRoomsFromStory, useUpdateRoom } from "@/hooks/roomHooks";
import { useCreateStory, useLocationStories } from "@/hooks/storyHooks";
import { Item } from "@/services/itemService";
import { StoryRoom } from "@/services/roomService";
import { ItemCategory } from "@/types/constantsTypes";
import { RoomFormInput, RoomFormvalues, RoomSchema } from "@/zodSchemas/roomSchema";
import { type StoryFormInput, type StoryFormValues, storySchema } from "@/zodSchemas/storySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ChevronDown, DoorOpen, Layers, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { de } from "zod/locales";
import { isDirty } from "zod/v3";
import ItemTypePicker from "./_components/ItemPicker";
import RoomFormFields from "@/components/ui/forms/roomForms/RoomForm";
import StoryFormFields from "@/components/ui/forms/storyForms/storyForm";
import LoadingState from "@/components/states/loadingState";
import CurtainInsertForm from "@/modules/curtains/itemForm";

const EMPTY_ROOM = { name: "", function: "", category: "", section: "" };

export default function AddStoryPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const { showToast } = useToast();

  const location = useLocationWithClient(id);

  const { data: stories, isPending: storiesPending, error: storiesError } = useLocationStories(id);

  const createStory = useCreateStory();

  const deleteRoom = useDeleteRoom();

  const deleteItem = useDeleteItem();

  const updateRoom = useUpdateRoom();

  const createRoom = useCreateRoom();

  function handleEditRoom(values: RoomFormvalues) {
    if (!editingRoom) return;

    updateRoom.mutate(
      { id: editingRoom.id, values },
      {
        onSuccess: () => {
          closeEdit();
          showToast("Ruimte bijgewerkt", "success");
        },
      },
    );
  }

  function handleCreateRoom(values: RoomFormvalues) {
    if (!id || !selectedStoryId) return;
    createRoom.mutate(
      { storyId: selectedStoryId, locationId: id, values: values },
      {
        onSuccess: () => {
          closeAdd();
          showToast("Ruimte toegevoegd", "success");
        },
      },
    );
  }

  const [editingRoom, setEditingRoom] = useState<StoryRoom | null>(null);

  const [deletingRoom, setDeletingRoom] = useState<StoryRoom | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<StoryRoom[]>([]);

  const [addingCategory, setAddingCategory] = useState<ItemCategory | null>(null);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  const [selectedItem, setSelectedItem] = useState<Item[]>([]);

  const [addStoryOpen, setAddStoryOpen] = useState(true);

  const [selectStoryOpen, setSelectStoryOpen] = useState(false);

  const [roomsOpen, setRoomsOpen] = useState(true);

  const [itemsOpen, setItemsOpen] = useState(true);

  const [addOpen, setAddOpen] = useState(false);

  const [addItemOpen, setAddItemOpen] = useState(false);

  const [selectedStories, setSelectedStories] = useState<string[]>([]);

  const selectedStoryId = selectedStories[0];

  const selectedRoomId = selectedRoom[0]?.id;

  const [roomPage, setRoomPage] = useState(0);
  const [itemPage, setItemPage] = useState(0);

  const pageSize = 20;

  const {
    data: rooms,
    error: roomError,
    isFetching,
  } = useRoomsFromStory(selectedStoryId, roomPage, pageSize);

  const {
    data: items,
    error: itemsError,
    isFetching: fetchingItems,
  } = useItemsFromRoom(selectedRoomId, itemPage, pageSize);

  const totalPages = Math.max(Math.ceil((rooms?.total ?? 0) / pageSize), 1);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<StoryFormInput, unknown, StoryFormValues>({
    resolver: zodResolver(storySchema),
    mode: "onTouched",
    defaultValues: { location_id: id ?? "", name: "" },
  });

  const {
    register: registerRoom,
    control: controlRoom,
    handleSubmit: handleSubmitRoom,
    reset: roomreset,
    formState: { errors: roomErrors },
  } = useForm<RoomFormInput, unknown, RoomFormvalues>({
    resolver: zodResolver(RoomSchema),
    mode: "onTouched",
    defaultValues: {},
  });

  useEffect(() => {
    if (addStoryOpen) setFocus("name");
  }, [addStoryOpen, setFocus]);

  useEffect(() => {
    if (!id) return;
    setValue("location_id", id);
  }, [id, setValue]);

  useEffect(() => {
    if (roomPage > totalPages - 1 && !isFetching) setRoomPage(totalPages - 1);
  }, [roomPage, totalPages]);

  if (location.isPending || storiesPending) return <LoadingState />;
  if (location.error || storiesError || roomError) {
    return (
      <RoomError
        onRetry={() => {
          location.refetch();
        }}
      />
    );
  }
  if (!location.data) return <NotFoundState backHref="/locations" backLabel="Naar locaties" />;

  if (!stories) return;

  function closeAddStory() {
    setAddStoryOpen(false);
    reset();
  }

  function handleAddStory(values: StoryFormValues) {
    createStory.mutate(values, {
      onSuccess: () => {
        showToast("Verdieping toegevoegd", "success");
        reset();
        setFocus("name");
      },
      onError: () => {
        showToast("Kon verdieping niet toevoegen", "error");
      },
    });
  }

  function openEdit(room: StoryRoom) {
    setEditingRoom(room);
    roomreset({
      name: room.name,
      function: room.function ?? "",
      category: room.category ?? "",
      section: room.section ?? "",
    });
  }

  function closeEdit() {
    setEditingRoom(null);
    roomreset();
  }

  function openAdd() {
    setAddOpen(true);
    roomreset(EMPTY_ROOM);
  }
  function closeAdd() {
    setAddOpen(false);
    roomreset(EMPTY_ROOM);
  }

  const selectedStory = stories.find((s) => s.id === selectedStories[0]);
  return (
    <div className="flex flex-col gap-6">
      <SubPageHeader
        title={location.data.name}
        description={`Voeg verdiepingen toe aan ${location.data.name}`}
        fallbackHref={`/locations/${id}`}
      />

      <div className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-primary/30">
        <button
          type="button"
          onClick={() => (addStoryOpen ? closeAddStory() : setAddStoryOpen(true))}
          aria-expanded={addStoryOpen}
          aria-controls="add-story-panel"
          className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Layers strokeWidth={1.75} className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted">Verdieping</span>
            <span className="block truncate text-sm font-medium text-ink">
              {addStoryOpen ? "Nieuwe verdieping" : "Verdieping toevoegen"}
            </span>
          </span>

          <Plus
            strokeWidth={1.75}
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted/60 transition duration-200 group-hover:text-primary ${
              addStoryOpen ? "rotate-45" : ""
            }`}
          />
        </button>

        {/* panel: unchanged */}
        <div
          id="add-story-panel"
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            addStoryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            <form
              onSubmit={handleSubmit(handleAddStory)}
              noValidate
              inert={!addStoryOpen}
              className={`border-t border-line transition-opacity duration-200 ${
                addStoryOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="space-y-4 p-4">
                <StoryFormFields register={register} errors={errors} control={control} />

                {createStory.error && (
                  <p role="alert" className="text-xs font-medium text-danger">
                    De verdieping kon niet worden opgeslagen. Probeer het opnieuw.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 px-4 pb-4">
                <Button variant="ghost" size="sm" onClick={closeAddStory}>
                  Annuleren
                </Button>
                <Button icon={Plus} type="submit" size="sm" loading={createStory.isPending}>
                  Toevoegen
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <button
          type="button"
          onClick={() => setSelectStoryOpen((open) => !open)}
          aria-expanded={selectStoryOpen}
          aria-controls="story-select-panel"
          className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
              selectedStory
                ? "bg-primary-soft text-primary"
                : "bg-surface text-muted group-hover:text-primary"
            }`}
          >
            <Layers strokeWidth={1.75} className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted">Verdieping</span>
            <span className={`block truncate text-sm font-medium text-ink`}>
              {selectedStory?.name ?? "Kies een verdieping"}
            </span>
          </span>

          <ChevronDown
            strokeWidth={1.75}
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted/60 transition duration-200 group-hover:text-primary ${
              selectStoryOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          id="story-select-panel"
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            selectStoryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            <div
              inert={!selectStoryOpen}
              className={`border-t border-line p-4 transition-opacity duration-200 ${
                selectStoryOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <StorySelector
                stories={stories}
                selectedStories={selectedStories}
                onChange={(val) => {
                  setSelectedStories([val]);
                  setRoomPage(0);
                  setSelectStoryOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {rooms && (
        <div className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-primary/30">
          <button
            type="button"
            onClick={() => setRoomsOpen((open) => !open)}
            aria-expanded={roomsOpen}
            aria-controls="rooms-panel"
            className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <DoorOpen strokeWidth={1.75} className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Ruimtes</span>
              <span className="block truncate text-sm font-medium text-ink tabular-nums">
                {rooms.total} {rooms.total === 1 ? "ruimte" : "ruimtes"}
              </span>
            </span>

            <ChevronDown
              strokeWidth={1.75}
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-muted/60 transition duration-200 group-hover:text-primary ${
                roomsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            id="rooms-panel"
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              roomsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="min-h-0 overflow-hidden" inert={!roomsOpen}>
              <div className="border-t border-line">
                <RoomSelector
                  rooms={rooms.rooms}
                  total={rooms.total}
                  page={roomPage}
                  onSelectRoom={(val) => {
                    setSelectedRoom((rooms) =>
                      !rooms.length ? [val] : rooms[0].id === val.id ? [] : [val],
                    );
                    setSelectedItem([]);
                  }}
                  selectedRooms={selectedRoom}
                  onAddRoom={openAdd}
                  pageSize={pageSize}
                  onPageChange={setRoomPage}
                  isFetching={isFetching}
                  onDelete={(val) => setDeletingRoom(val)}
                  onEdit={(val) => openEdit(val)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRoomId && (
        <div className="overflow-hidden rounded-xl border border-line bg-white transition-colors duration-200 hover:border-primary/30">
          <button
            type="button"
            onClick={() => setItemsOpen((open) => !open)}
            aria-expanded={itemsOpen}
            aria-controls="items-panel"
            className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Box strokeWidth={1.75} className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Objecten</span>
              <span className="block truncate text-sm font-medium text-ink tabular-nums">
                {items?.total} {items?.total === 1 ? "object" : "objecten"}
              </span>
            </span>

            <ChevronDown
              strokeWidth={1.75}
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-muted/60 transition duration-200 group-hover:text-primary ${
                itemsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            id="rooms-panel"
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              itemsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="min-h-0 overflow-hidden" inert={!itemsOpen}>
              <div className="border-t border-line">
                {fetchingItems && !items ? (
                  <LoadingState />
                ) : items ? (
                  <ItemSelector
                    items={items.items}
                    total={items.total}
                    page={itemPage}
                    onSelectItem={(val) => {
                      setSelectedItem((item) => (item.length ? [] : [val]));
                    }}
                    selectedItems={selectedItem}
                    onAddItem={() => setAddItemOpen(true)}
                    pageSize={pageSize}
                    onPageChange={setItemPage}
                    onDelete={(val) => setDeletingItem(val)}
                    onEdit={(val) => setEditingItem(val)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        open={!!deletingRoom}
        onClose={() => setDeletingRoom(null)}
        onConfirm={() =>
          deleteRoom.mutate(deletingRoom!.id, {
            onSuccess: () => {
              setDeletingRoom(null);
              showToast("Ruimte verwijderd", "success");
            },
          })
        }
        title={`Ruimte ${deletingRoom?.name} verwijderen?`}
        loading={deleteRoom.isPending}
        error={
          deleteRoom.error
            ? "De ruimte kon niet worden verwijderd. Probeer het opnieuw."
            : undefined
        }
      >
        De ruimte en alle objecten erin zijn daarna niet meer zichtbaar. Eerdere uitvoeringen
        blijven bewaard in de historie.
      </DeleteModal>

      <DeleteModal
        open={!!deletingItem}
        onConfirm={() =>
          deleteItem.mutate(deletingItem?.id ?? "", {
            onSuccess: () => {
              setDeletingItem(null);
              showToast("Object verwijderd", "success");
            },
          })
        }
        onClose={() => setDeletingItem(null)}
        title={`Object ${deletingItem?.name} verwijderen?`}
        error={deleteItem.error ? "Dit object kon niet worden verwijderd" : undefined}
      />

      <EditModal
        open={!!editingRoom}
        onClose={closeEdit}
        onSubmit={handleSubmitRoom(handleEditRoom)}
        title={`Ruimte ${editingRoom?.name} bewerken`}
        description="Wijzig de gegevens van deze ruimte"
        icon={DoorOpen}
        loading={updateRoom.isPending}
        submitDisabled={!isDirty}
        error={
          updateRoom.error
            ? "De ruimte kon niet worden opgeslagen. Probeer het opnieuw."
            : undefined
        }
      >
        <RoomFormFields register={registerRoom} errors={roomErrors} control={controlRoom} />
      </EditModal>

      <AddModal
        open={addOpen}
        onClose={closeAdd}
        onSubmit={handleSubmitRoom(handleCreateRoom)}
        title="Ruimte toevoegen"
        description="Voeg een ruimte toe aan deze verdieping."
        icon={DoorOpen}
        loading={createRoom.isPending}
        error={createRoom.error ? "Ruimte kon niet worden toegevoegd." : undefined}
      >
        <RoomFormFields register={registerRoom} errors={roomErrors} control={controlRoom} />
      </AddModal>

      <ItemTypePicker
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        available={["curtain"]}
        onPick={(category) => {
          setAddingCategory(category);
        }}
      />

      {selectedRoomId && addingCategory === "curtain" && (
        <CurtainInsertForm
          roomId={selectedRoomId}
          onClose={() => {
            setAddingCategory(null);
          }}
          onCreated={() => {
            showToast("Gordijn toegevoegd", "success");
            setAddingCategory(null);
            setAddItemOpen(true);
          }}
        />
      )}
    </div>
  );
}
