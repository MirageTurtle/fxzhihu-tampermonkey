// ==UserScript==
// @name         fxzhihu
// @namespace    fxzhihu
// @version      0.1
// @description  add a button for fxzhihu link in zhihu page
// @author       MirageTurtle
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

// Function to get the prototype button
function getPrototypeButton() {
    // Get the follow button
    var buttons = document.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
	if (buttons[i].innerText.includes("分享")) {
	    return buttons[i];
	}
    }
    return null;
}

// Function to create the button and return it
function createButton(fxzhihuLink, prototypeButton) {
    if (prototypeButton == null) {
	return null;
    }
    // copy the prototype button to create a new button
    var button = prototypeButton.cloneNode(true);

    // Set the button text
    button.innerHTML = button.innerHTML.replace("分享", "fxzhihu");

    // Add an event listener to the button
    button.addEventListener("click", function() {
	// Open the link in a new tab
	window.open(fxzhihuLink, "_blank");
    });

    // Return the button element
    return button;
}

function getAnswerList() {
    var answerList = document.querySelectorAll('div.List-item');
    return answerList;
}

function getFxzhihuLink(answer) {
    // data-za-extra-module='{"card":{"has_image":false,"has_video":false,"content":{"type":"Answer","token":"2441248826","upvote_num":22,"comment_num":1,"publish_timestamp":null,"parent_token":"299166656","author_member_hash_id":"0550880085db2862b0d63ccb9a7fea57"}}}'
    var answerData = answer.childNodes[0].childNodes[0].getAttribute('data-za-extra-module');
    if (JSON.parse(answerData) == null) {
	console.log("Error: Cannot parse answer data: " + answer);
	return null;
    }
    var answerID = JSON.parse(answerData).card.content.token;
    var questionID = JSON.parse(answerData).card.content.parent_token;
    var fxzhihuLink = "https://www.fxzhihu.com/question/" + questionID + "/answer/" + answerID + "?redirect=false"
    return fxzhihuLink;
}

// Function to insert buttons
function insertButtons(answerList) {
    // Get the prototype button
    var prototypeButton = getPrototypeButton();
    // For each answer, insert a button
    answerList.forEach(function(answer) {
	// Get the fxzhihu link
	var fxzhihuLink = getFxzhihuLink(answer);
	console.log(fxzhihuLink);

	// Create the fxzhihu button
	var fxzhihuButton = createButton(fxzhihuLink, prototypeButton);
	console.log(fxzhihuButton);
	// Insert the new button to the last one of ContentItem-actions
	// var contentItemActions = answer.querySelector('div.ContentItem-actions').lastElementChild;
	// contentItemActions.appendChild(fxzhihuButton);
	var actions = answer.querySelector('div.ContentItem-actions')
	console.log(actions);
	actions.appendChild(fxzhihuButton);

	// // Insert the new button next to the follow button
	// var buttons = answer.querySelectorAll('button');
	// var followButton = null;
	// buttons.forEach(function(button) {
	//     if (button.innerText.includes("关注")) {
	// 	followButton = button;
	//     }
	// });
	// if (followButton == null) {
	//     return;
	// }
	// followButton.parentNode.insertBefore(newButton, followButton);

	// // Insert the fxzhihu button next to AuthorInfo
	// var authorInfo = answer.querySelector('div.AuthorInfo');
	// authorInfo.parentNode.appendChild(fxzhihuButton);
    });
}

(function() {
    'use strict';

    // Call the function to insert buttons
    var answerList = getAnswerList();
    insertButtons(answerList);
})();
