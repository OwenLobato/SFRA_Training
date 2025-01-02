// Refresh data when clicking on refresh image
const refreshButtons = document.querySelectorAll('.refresh');
refreshButtons.forEach((element) => {
	element.addEventListener('click', (event) => {
		event.preventDefault();
		const url = element.getAttribute('data-url');
		const refreshurl = element.getAttribute('data-refreshurl');
		if (url && refreshurl) {
			refreshData(url, refreshurl);
		}
	});
});

// AJAX Request to an endpoint to remove custom object data and reload current page.
function refreshData(url, refreshurl) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = () => {
		if (xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			if(response.success) {
				window.location = refreshurl;
			}
		} else {
			console.error('Request failed.  Returned status of ' + xhr.status);
		}
	};

	xhr.send();
};
