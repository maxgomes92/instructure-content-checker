let STORAGE = {}

async function start () {
  STORAGE = await getCheckboxesData()

  // Get html elements
  const topics = document.querySelectorAll('#context_modules li span[class="item_name"]')
  
  for (let topic of topics) {
    const anchor = topic.querySelector('a')
  
    if (anchor) {
      const name = `checkbox-${anchor.getAttribute("href")}`

      // Creates checkbox
      const checkbox = document.createElement("input")
      checkbox.setAttribute("type", "checkbox")
      checkbox.style.setProperty("float", "right")
      checkbox.setAttribute("name", name)
      checkbox.checked = !!STORAGE[name]
      checkbox.onclick = handleCheckboxClick

      const el = topic.appendChild(checkbox)
      applyCheckboxStyling(el)
    }
  }

  syncCheckboxesData()
}

function getStorageKey () {
  return "checkboxes-" + window.location.href.split('?')[0]
}

function syncCheckboxesData () {
  chrome.storage.sync.set({[getStorageKey()]: STORAGE})
}

function getCheckboxesData () {
  return new Promise ((resolve, reject) => {
    const key = getStorageKey()
    chrome.storage.sync.get(key, function (obj) {
      resolve(obj && obj[key] ? obj[key] : {})
    })
  })
}

function handleCheckboxClick (event) {
  const checkbox = event.target

  applyCheckboxStyling(checkbox)

  STORAGE[checkbox.getAttribute("name")] = checkbox.checked
  syncCheckboxesData()
}

function applyCheckboxStyling (checkbox) {
  const parent = checkbox.closest('div[class*="student-view"]')

  if (checkbox.checked) {
    parent.style.setProperty("background", "#daf0f3")
  } else {
    parent.style.setProperty("background", "unset")
  }
}

start()
