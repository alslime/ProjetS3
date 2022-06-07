import {JetView} from "webix-jet";

export default class EditorHeader extends JetView {
    config() {
        return {
            template: () => this.template(this.data)
        }
    }

    template(obj) {`
             <div class='flex_container_h' style='width: 100%;'>
               <img src="/photos/${obj.cip}.jpeg"/>
               <div style="width: 80%;" class='flex_item'>${obj.inscriptor}</div>
			   <div style='font-size: 10px;'>${moment(obj.inscription).format('ll')}</div>
             </div>
           `
    }

   setData(data) {
        this.data = data;
   }

}
