import { writable } from 'svelte/store'

import type { ListsState, List } from '$lib/types'

export const initialListsState: ListsState = {
  lists: [],
  currentListId: '',
}

const createListsState = (initialState: ListsState) => {
  const { subscribe, update, set } = writable(initialState)

  return {
    subscribe,
    set,
    setCurrentList: (id: string) => {
      update((s) => {
        s.currentListId = id
        return s
      })
    },
    addList: (list: List) => {
      update((s) => {
        s.lists.push(list)
        return s
      })
    },
    updateList: (id: string, updateList: List) => {
      update((s) => {
        s.lists = s.lists.map((l) => (l.id === id ? { ...l, ...updateList } : l))
        return s
      })
    },
    deleteList: (id: string) => {
      update((s) => {
        s.lists = s.lists.filter((l) => l.id !== id)
        return s
      })
    },
    togglePinnedList: (id: string) => {
      update((s) => {
        const list = s.lists.find((l) => l.id === id)
        if (list) list.pinned = !list.pinned
        return s
      })
    },
    assignTrashToList: (id: string) => {
      update((s) => {
        s.lists = s.lists.map((l) =>
          l.id === id ? { ...l, trash: true, trashedAt: new Date() } : l
        )
        return s
      })
    },
    unassignTrashToList: (id: string) => {
      update((s) => {
        s.lists = s.lists.map((l) =>
          l.id === id ? { ...l, trash: false, trashedAt: undefined } : l
        )
        return s
      })
    },
    removeTagFromList: (id: string, tagId: string) => {
      update((s) => {
        s.lists = s.lists.map((l) =>
          l.id === id
            ? {
                ...l,
                tagIds: l.tagIds.filter((tid) => tid !== tagId),
              }
            : l
        )
        return s
      })
    },
    emptyTrashLists: () => {
      update((s) => {
        s.lists = s.lists.filter((l) => !l.trash)
        return s
      })
    },
  }
}

export const listsState = createListsState(initialListsState)
