import { LightningElement,api } from 'lwc';
import LightningConfirm from 'lightning/confirm';
export default class RecordCardQuickFiles extends LightningElement {
    @api recordId;

    onDeleteAllFilesButtonClick() {
        const confirmation = LightningConfirm.open({
            Message: "Are you sure you want to delete all files?",
            Variant: "headerless",
            Label: "Are you sure you want to delete all files?"
        });
        if (confirmation) {
            
        }
    }
}