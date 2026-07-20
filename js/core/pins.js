/*
  pins.js
  -------
  Lets a user pin frequently-used calculators so they don't have to scroll
  to find them. Same approach as your previous site: a flat list of
  calculator ids in localStorage.
*/
const KEY = 'pharmachrome_pinned';

export function getPinned() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function setPinned(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function togglePin(id) {
  let pinned = getPinned();
  if (pinned.includes(id)) {
    pinned = pinned.filter(x => x !== id);
  } else {
    pinned.push(id);
  }
  setPinned(pinned);
  return pinned;
}
