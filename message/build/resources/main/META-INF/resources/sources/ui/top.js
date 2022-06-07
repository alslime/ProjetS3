import {JetView, plugins} from "webix-jet";
import MessageView from "./message/MessageView.js";


export default class TopView extends JetView {

    config() {
       // const theme = this.app.config.theme;
        return {
            rows: [
                MessageView,
            ],
        };
    }

}