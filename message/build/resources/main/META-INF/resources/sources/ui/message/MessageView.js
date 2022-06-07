import {JetView} from "webix-jet";
import {
    getMessages,
    setMessage,
    delMessage,
    getMessage,
    getNewId
} from "./MessageModel.js";


export default class MessageView extends JetView {
    config() {

        const list = {
            view: "list",
            type: {
                height: "auto"
            },
            // polling interval is 1 second
            datathrottle: 5000,
            template: (obj) => this.template(obj),
            datafetch: 5, // 5 records
            url: "http://localhost:8089/api/getallmessages",
            pager: "pager"
        };
        const pager = {
            view: "pager",
            template: "{common.first()}{common.prev()}Page {common.page()} de #limit#{common.next()}{common.last()}",
            id: "pager",
            size: 10,
            group: 8
        }

        return {
            rows: [
                header,
                list,
                pager

            ]
        }
    };

    template(obj) {
        return `
		<div class='flex_container_h'>
          <div class='flex_container_v' style='width: 10%;'>
              <div class='flex_item' ><img src="/photos/${obj.cip}.jpeg"/></div>
              <div class='flex_item' style='height: 20px'>${obj.inscriptor}</div>
			    <div style='font-size: 10px;'height: 12px'>${moment(obj.inscription).format('ll' +
            '')}</div>
          </div>
		  <div style='width: 75%; text-align: left;'>
              ${obj.description}
          </div>
		</div>`;
    }

    async init(view) {
        this.view = view;
        this.list = this.view.getChildViews()[1];
    }
}




