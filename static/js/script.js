function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

// search_box = document.getElementById("myInput")
// test = ['mohsen', 'hassan', 'ghoitas', 'gardolog']
// autocomplete(search_box, test)

let loaded_city = {}

function update_city_status(data) {
  city_name = data['location']['name'].toLowerCase()
  node = loaded_city[city_name]

  // Update weather status icon
  icon = node.querySelector('img')
  icon.src = "https:" + data['corrent']['condition']['icon']

  // Update content of a node
  title = node.querySelector('span.title')
  title.innerText = data['location']['name']

  subtitle = node.querySelector('span.subtitle')
  subtitle.innerText = `${data['current']['temp_c']}`

  discription = node.querySelector('span.subtitle')
  discription.innerText = data['current']['condition']['text']

}

function addCity(data) {
  let content_block = document.getElementById('contentBlock')

  let name = data['location']['name']
  let temp_c = data['current']['temp_c']
  let feelslike = data['current']['feelslike_c']
  let condition_text = data['current']['condition']['text'].split(" ")[0]
  let icon_url = data['current']['condition']['icon']
  let country = data['location']['country']
  let local_time = data['location']['localtime'].split(' ')[1]

  let last_updated = data['current']['last_updated'].replaceAll('-', '').replace(' ', ',').slice(2)

console.log(name)
  let item = document.createElement('div')
  item.classList.add('col-6', 'col-sm-6', 'col-md-4', 'col-lg-3', 'px-3')
 
  let weather_content = `
    <div class="row d-flex justify-content-center py-3">
        <div class="card text-body p-0" style=" border-radius: 35px;">
            <div class="card-body p-3 px-0 p-sm-3">

                <div class="d-flex">
                    <h6 class="flex-grow-1 bold">${name}</h6>
                    <h6>${local_time}</h6>
                </div>
                <div>
                    <h6 class="f-italic country">${country}</h6>
                </div>

                <div class="d-flex flex-column text-center m-2 mt-sm-5 mb-sm-4">
                    <h6 class="display-5 display-sm-4 mb-0 font-weight-bold"> ${temp_c}°C </h6>
                    <span class="small" style="color: #868B94">${condition_text}</span>
                </div>

                <div class="d-flex align-items-center">
                    <div class="flex-grow-1 detail">
                        <div><i class="fas fa-wind fa-fw"></i> <span
                                class="ms-0 ms-sm-1">
                                feelslike: ${feelslike}°C
                            </span>
                        </div>
                        <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span
                                class="ms-0 ms-sm-1">
                                last updated
                            </span></div>
                        <div><i class="fas fa-sun fa-fw" style="color: #868B94;"></i> <span
                                class="ms-0 ms-sm-1">
                                ${last_updated}
                            </span></div>
                    </div>
                    <div class="">
                        <img src="https:${icon_url}"
                            width="80px">
                    </div>
                </div>
        </div>
    </div>
</div>
  `
  item.innerHTML += weather_content
  content_block.appendChild(item)

  loaded_city[data['location']['name'].toLowerCase()] = item

}

function update_content(data) {
  city_name = data['location']['name'].toLowerCase()

  if (city_name in loaded_city) {
    update_city_status(city_name)
  } else {

    addCity(data)
  }

}

function fetch_default_items() {
  fetch('api/default-items', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(items => render_default_items(items))
    .catch(err => console.log(err))

}

async function render_default_items(items) {
  try {
    const responses = await Promise.all(items.map(item => fetch(`/api/${item}`)))
    const data = await Promise.all(responses.map(res => res.json()))
    Promise.all(data.map(d => update_content(d)))
  }
  catch (err) {
    console.error("Error fetching data:", error);
  }

}

document.getElementById('addForm').addEventListener('submit', (event) => {
  event.preventDefault()

  let city = document.getElementById("cityName").value

  fetch(`/api/${city}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => update_content(data))

})
