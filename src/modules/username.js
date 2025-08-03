import PubSub from "pubsub-js";

class Username {
    _username = usernameStorage().storedUsername._username;

    get userName() {
        return this._username;
    }
    set userName(value) {
        if (value === "") return;
        this._username = value;
    }
}
const usernameStorage = () => {
    const saveUsername = (userInfoTray) => {
        localStorage.setItem("Username", JSON.stringify(userInfoTray));
    }
    const storedUsername = JSON.parse(localStorage.getItem("Username")) || '';
    return { saveUsername, storedUsername };
};

PubSub.subscribe("edit username", (msg, usernameObj) => {
    usernameStorage().saveUsername(usernameObj)
});
const newUser = new Username();
export { newUser };