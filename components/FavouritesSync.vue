<template>
  <span class="fav-sync" aria-hidden="true" style="display:none" />
</template>

<script setup>
// On sign-in, merge the local list with the account's stored list (union by id),
// set it locally, and write the merged result back to the user's metadata.
const { isLoaded, isSignedIn, user } = useUser()
const { items, setAll } = useFavourites()
let synced = false

watch([isLoaded, isSignedIn], async ([loaded, signed]) => {
  if (!loaded || !signed || !user.value || synced) return
  synced = true
  const remote = Array.isArray(user.value.unsafeMetadata?.favourites)
    ? user.value.unsafeMetadata.favourites
    : []
  const map = new Map()
  for (const a of [...remote, ...items.value]) if (a?.mal_id) map.set(a.mal_id, a)
  const merged = [...map.values()]
  setAll(merged)
  try {
    await user.value.update({ unsafeMetadata: { ...(user.value.unsafeMetadata || {}), favourites: merged } })
  } catch { /* ignore */ }
}, { immediate: true })
</script>
