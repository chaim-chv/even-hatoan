async function submitchoices() {
  document.getElementById("results").innerHTML = "";
  let city = document.getElementById("city").value;
  let item = document.getElementById("item").value;
  let category = document.getElementById("category").value;
  const response = await fetch(`${window.location.origin}/data/lost`, {
    body: JSON.stringify({ city: city, item: item, category: category }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 204) {
    let itemEL = document.createElement("p");
    itemEL.innerHTML = `לא מצאנו במאגר...`;
    itemEL.setAttribute("class", "item");
    document.getElementById("results").appendChild(itemEL);
    return
  }
  const data = await response.json();
  console.log(data);
  if (response.status === 200) {
    for (let object of data) {
      let itemEL = document.createElement("p");
      itemEL.innerHTML = `שם: ${object.item}<br>
            עיר: ${object.city}<br>
            קטגוריה: ${object.category}`;
      itemEL.setAttribute("class", "item");
      document.getElementById("results").appendChild(itemEL);
    }
    return
  }
}

// listener to 'enter' button click
document.querySelector("#city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitchoices();
  }
});
document.querySelector("#item").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitchoices();
  }
});
document.querySelector("#category").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitchoices();
  }
});
