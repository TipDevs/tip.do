import PubSub from "pubsub-js";

class Username {
    _username = "";

    get userName() {
        return this._username;
    }
    set userName(value) {
        this._username = value;
    }
}
const usernameStorage = () => {
    const saveUsername = (userInfoTray) => {
        localStorage.setItem("Username", JSON.stringify(userInfoTray));
    }
    return { saveUsername };
};

PubSub.subscribe("edit username", (msg, usernameObj) => {
    usernameStorage().saveUsername(usernameObj)
});
const newUser = new Username();
export { newUser };