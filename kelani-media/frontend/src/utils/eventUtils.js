// Small helper functions used by the event pages

// "Sat, 21 Nov 2026"
export const formatEventDate = (dateText) => {
  if (!dateText) return 'Date not set'
  return new Date(dateText).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// "6:30 PM"
export const formatEventTime = (dateText) => {
  if (!dateText) return 'Time not set'
  return new Date(dateText).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// "Rs. 1,500.00" or "Free"
export const formatPrice = (price) => {
  if (!price) return 'Free'
  return `Rs. ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

// True if the user created the event or was added as an organizer
export const isEventOrganizer = (event, userId) => {
  if (!event || !userId) return false
  if (event.organizerId === userId) return true
  return (event.organizers || []).some((organizer) => organizer.userId === userId)
}

export const isFollowingEvent = (event, userId) => {
  return (event?.followerIds || []).includes(userId)
}
