import { AppListenerEffectAPI, AppStartListening } from "@/store"
import { Unsubscribe } from "@reduxjs/toolkit"
import { componentsActions } from "@/redux/currentApp/editor/components/componentsSlice"
import { displayNameActions } from "@/redux/currentApp/displayName/displayNameSlice"
import { DisplayNameGenerator } from "@/utils/generators/generateDisplayName"

async function handleDeleteExecution(
  action: ReturnType<typeof componentsActions.deleteComponentNodeReducer>,
  listenerApi: AppListenerEffectAPI,
) {
  DisplayNameGenerator.removeDisplayName(action.payload.displayName)
}

export function setupComponentsListeners(
  startListening: AppStartListening,
): Unsubscribe {
  const subscriptions = [
    startListening({
      actionCreator: componentsActions.deleteComponentNodeReducer,
      effect: handleDeleteExecution,
    }),
  ]

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe())
  }
}