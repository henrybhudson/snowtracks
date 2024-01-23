/*

app-alert.js
============
This file exports the AppAlert function to display status messages on screen.

*/

const AppAlert = (status, message) => {
        const element = document.createElement('div')
        element.className = `alert alert-${status}`;

        // Change the message icon depending on success or failure
        switch (status) {
                case "error":
                        element.innerHTML = `<i class="fa fa-warning"></i>&nbsp;&nbsp;${message}`;
                        break;
                case "success":
                        element.innerHTML = `<i class="fa fa-check"></i>&nbsp;&nbsp;${message}`;
                        break;
        }

        // Add the created element to the page
        document.body.appendChild(element);
};

export default AppAlert;