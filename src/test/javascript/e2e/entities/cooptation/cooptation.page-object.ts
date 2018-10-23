import { element, by, ElementFinder } from 'protractor';

export class CooptationComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-cooptation div table .btn-danger'));
    title = element.all(by.css('jhi-cooptation div h2#page-heading span')).first();

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

export class CooptationUpdatePage {
    pageTitle = element(by.id('jhi-cooptation-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    profileInput = element(by.id('field_profile'));
    performedOnInput = element(by.id('field_performedOn'));
    coopterSelect = element(by.id('field_coopter'));
    cooptedSelect = element(by.id('field_coopted'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setProfileInput(profile) {
        await this.profileInput.sendKeys(profile);
    }

    async getProfileInput() {
        return this.profileInput.getAttribute('value');
    }

    async setPerformedOnInput(performedOn) {
        await this.performedOnInput.sendKeys(performedOn);
    }

    async getPerformedOnInput() {
        return this.performedOnInput.getAttribute('value');
    }

    async coopterSelectLastOption() {
        await this.coopterSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async coopterSelectOption(option) {
        await this.coopterSelect.sendKeys(option);
    }

    getCoopterSelect(): ElementFinder {
        return this.coopterSelect;
    }

    async getCoopterSelectedOption() {
        return this.coopterSelect.element(by.css('option:checked')).getText();
    }

    async cooptedSelectLastOption() {
        await this.cooptedSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async cooptedSelectOption(option) {
        await this.cooptedSelect.sendKeys(option);
    }

    getCooptedSelect(): ElementFinder {
        return this.cooptedSelect;
    }

    async getCooptedSelectedOption() {
        return this.cooptedSelect.element(by.css('option:checked')).getText();
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

export class CooptationDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-cooptation-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-cooptation'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
