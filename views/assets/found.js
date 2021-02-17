async function submitfound() {
  document.getElementById("results").innerHTML = "";
  let city = document.getElementById("city").value;
  let item = document.getElementById("item").value;
  let category = document.getElementById("category").value;
  const response = await fetch(`${window.location.origin}/data/found`, {
    body: JSON.stringify({ city: city, item: item, category: category }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data);
  if (response.status === 401) {
    let itemEL = document.createElement('p')
    itemEL.innerHTML = `לא נכנס כראוי`
    itemEL.setAttribute("class", "item")
    document.getElementById("results").appendChild(itemEL)
    return
  }
  if (response.status === 201) {
    let itemEL = document.createElement("p")
    itemEL.innerHTML = `נוסף בהצלחה`
    itemEL.setAttribute("class", "item")
    document.getElementById("results").appendChild(itemEL)
    return
  }
}

// listener to 'enter' button click
document.querySelector("#city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitfound();
  }
});
document.querySelector("#item").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitfound();
  }
});
document.querySelector("#category").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitfound();
  }
});
