
import { getTracks } from "./index.js";

const displayTracks = () => {

};

getTracks().then((tracks) => {
        if (tracks) {
                displayTracks();
        }
});