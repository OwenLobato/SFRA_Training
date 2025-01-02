// Current modal DOM element
const modal = document.getElementById('modal');

// Open modal when click
const elements = document.querySelectorAll('.openModal');
elements.forEach((element) => {
	element.addEventListener('click', (event) => {
		event.preventDefault();
		const url = element.getAttribute('data-url');
		if (url) {
			openAjaxModal(url);
		}
	});
});

// Open modal after retrieving data from the url and update values with the ones received from the controller
function openAjaxModal(url) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = () => {
		if (xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				document.querySelector('#modal h2').innerHTML = response.title;
				document.querySelector('#modal-text').innerHTML = response.body;
				openModal();
			}
		} else {
			console.error('Request failed.  Returned status of ' + xhr.status);
		}
	};

	xhr.send();
};

function openModal() {
	modal.style.display = "block";
}

// Close modal window
const span = document.getElementsByClassName("closeModal")[0];
span.onclick = function() {
	closeModal();
}
function closeModal() {
	modal.style.display = "none";
}

// Event when clicking anywhere outside the modal window
window.onclick = function(event) {
	if (event.target == modal) {
		closeModal();
	}
}
