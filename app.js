function MyText(text, fontSize, fontColor, backgroundColor) {
  this.text = text;
  this.fontSize = fontSize;
  this.fontColor = fontColor;
  this.backgroundColor = backgroundColor;
}

function Article(imageLink, text, type) {
  this.imageLink = imageLink;
  this.text = text;
  this.type = type;
}

// Retrieving our data and converting it back into an array
let articles =
  localStorage.getItem("articles") != null
    ? JSON.parse(localStorage.getItem("articles"))
    : [];

let action;

// Get refferences to objets in DOM
const imageSection = $("#imageSection");
const txtSection = $("#textSection");
const addButton = $("#addButton");
const articleList = $("#articleList");
const selectedImageLink = $("#selectedImageLink");
const userText = $("#userText");
const userSelctedFontSize = $("#userSelectedFontSize");
const sliderValue = $("output");
const userSelctedFontColor = $("#userSelectedFontColor");
const userSelcteBackgroundColor = $("#userSelectedBackgroundColor");
let selectedImage = $("input:radio[name=selectedImage]");

// Select which menus to show
function enabledMenus(img, txt, btn) {
  img ? imageSection.show() : imageSection.hide();
  txt ? txtSection.show() : txtSection.hide();
  btn ? addButton.show() : addButton.hide();
}

// Shows selected menu
function showMenu(action) {
  event.preventDefault();
  switch (action) {
    case "img":
      enabledMenus(true, false, true);
      selectedImageLink.focus();
      this.action = action;
      break;
    case "txt":
      enabledMenus(false, true, true);
      userText.focus();
      this.action = action;
      break;
    case "all":
      enabledMenus(true, true, true);
      selectedImageLink.focus();
      this.action = action;
      break;
    case "close":
      enabledMenus(false, false, false);
      resetValues();
      break;
  }
}

// Resets input values
function resetValues() {
  selectedImageLink.val("");
  userSelctedFontSize.val(16);
  sliderValue.val(userSelctedFontSize.val());
  userText.val("");
  userSelctedFontColor.val("#000000");
  userSelcteBackgroundColor.val("#FFFFFF");
}

// Add articles to main list
function addArticle() {
  event.preventDefault();
  switch (this.action) {
    case "img":
      articles.push(
        new Article(
          selectedImageLink.val() != ""
            ? selectedImageLink.val()
            : selectedImage,
          null,
          this.action
        )
      );
      break;
    case "txt":
      articles.push(
        new Article(
          null,
          new MyText(
            userText.val(),
            userSelctedFontSize.val(),
            userSelctedFontColor.val(),
            userSelcteBackgroundColor.val()
          ),
          this.action
        )
      );
      break;
    case "all":
      articles.push(
        new Article(
          selectedImageLink.val() != ""
            ? selectedImageLink.val()
            : selectedImage,
          new MyText(
            userText.val(),
            userSelctedFontSize.val(),
            userSelctedFontColor.val(),
            userSelcteBackgroundColor.val()
          ),
          this.action
        )
      );
      break;
  }
  updateArticleList();
  showMenu("close");
}

function updateArticleList() {
  articleList.empty();
  if (articles.length > 0) {
    articles.map(function(article, id) {
      displayArticle(article, id);
    });
  } else {
    articleList.append($("<li>").text("Šis saraksts ir tukšs."));
  }
  // Storing our array as a string in local storage
  localStorage.setItem("articles", JSON.stringify(articles));
}

function createMenuIcon(action, id, icon) {
  return $("<div>")
    .addClass("button")
    .append(
      $('<a href="#" onclick="doAction(\'' + action + "'," + id + ')">').append(
        '<i class="' + icon + '"></i>'
      )
    );
}

// Display article
function displayArticle(article, id) {
  let { imageLink, text, type } = article;
  const upIcon =
    id != 0 ? createMenuIcon("moveUp", id, "fas fa-long-arrow-alt-up") : null;
  const downIcon =
    id != articles.length - 1
      ? createMenuIcon("moveDown", id, "fas fa-long-arrow-alt-down")
      : null;
  const deleteIcon = createMenuIcon("delete", id, "fas fa-times");

  const options = $("<div>")
    .addClass("js-action-icons")
    .append(upIcon, downIcon, deleteIcon);

  const articleImage =
    type == "all" || type == "img"
      ? $("<div>")
          .addClass("js-article-box")
          .append(
            $(
              '<img class="js-responsive-image" src=' +
                imageLink +
                " alt=" +
                imageLink +
                "/>"
            )
          )
      : null;
  const articleText =
    type == "all" || type == "txt"
      ? $("<div>")
          .addClass("js-article-box")
          .append(
            $("<p>", {
              css: {
                color: text.fontColor,
                "font-size": text.fontSize + "px",
                "background-color": text.backgroundColor
              }
            }).text(text.text)
          )
      : null;

  articleList.append(
    $("<li>").append(
      $("<div>").append(
        options,
        $("<div>")
          .attr("class", "js-article")
          .append(articleImage, articleText)
      )
    )
  );
}

function doAction(action, id) {
  event.preventDefault();
  let temp;
  switch (action) {
    case "moveUp":
      if (id > 0) {
        temp = articles[id - 1];
        articles[id - 1] = articles[id];
        articles[id] = temp;
      }
      break;
    case "moveDown":
      if (id < articles.length - 1) {
        temp = articles[id + 1];
        articles[id + 1] = articles[id];
        articles[id] = temp;
      }
      break;
    case "delete":
      articles.splice(id, 1);
      break;
  }
  updateArticleList();
}

$(document).ready(function() {
  updateArticleList();
  selectedImage.change(function() {
    if ($(this).is(":checked")) {
      selectedImage = $(this).val();
    }
  });
  userSelctedFontSize.on("input", function() {
    sliderValue.val(userSelctedFontSize.val());
  });
});
