import { element, by, ElementFinder } from 'protractor';

export class SkillComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-skill div table .btn-danger'));
    title = element.all(by.css('jhi-skill div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getText();
    }
}

export class SkillUpdatePage {
    pageTitle = element(by.id('jhi-skill-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    codeInput = element(by.id('field_code'));
    labelInput = element(by.id('field_label'));
    cooptationSelect = element(by.id('field_cooptation'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setCodeInput(code) {
        await this.codeInput.sendKeys(code);
    }

    async getCodeInput() {
        return this.codeInput.getAttribute('value');
    }

    async setLabelInput(label) {
        await this.labelInput.sendKeys(label);
    }

    async getLabelInput() {
        return this.labelInput.getAttribute('value');
    }

    async cooptationSelectLastOption() {
        await this.cooptationSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async cooptationSelectOption(option) {
        await this.cooptationSelect.sendKeys(option);
    }

    getCooptationSelect(): ElementFinder {
        return this.cooptationSelect;
    }

    async getCooptationSelectedOption() {
        return this.cooptationSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class SkillDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-skill-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-skill'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
