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

function update_city_status(data){
  city_name = data['location']['name'].toLowerCase()
  node = loaded_city[city_name]

  // Update weather status icon
  icon = node.querySelector('img')
  icon.src = "https:"+data['corrent']['condition']['icon']

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

  let box = document.createElement('div')
  box.classList.add('box')
  let article = document.createElement('article')
  article.classList.add('media')
  box.appendChild(article)

  console.log(data)
  let div_icon = `
  <div class="media-left">
      <figure class="image is-50x50">
          <img src="https:${data['current']['condition']['icon']}" alt="Image">
      </figure>
  </div>
  `
  let media_content = `
  <div class="media-content">
      <div class="content">
          <p>
              <span class="title">${ data['location']['name'] }</span>
              <br>
              <span class="subtitle">${ data['current']['temp_c'] }° C</span>
              <span class="discription">${ data['current']['condition']['text']}° C</span>
          </p>
      </div>
  </div>
  `

  article.innerHTML += div_icon
  article.innerHTML += media_content
  content_block.appendChild(box)

  loaded_city[data['location']['name'].toLowerCase()] = box

}

function update_content(data){
  city_name = data['location']['name'].toLowerCase()

  if (city_name in loaded_city){
    update_city_status(city_name)
  }else{

    addCity(data)
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
