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
    phoneNumberInput = element(by.id('field_phoneNumber'));
    linkedInInput = element(by.id('field_linkedIn'));
    firstNameInput = element(by.id('field_firstName'));
    lastNameInput = element(by.id('field_lastName'));
    emailInput = element(by.id('field_email'));
    coopterSelect = element(by.id('field_coopter'));
    skillsSelect = element(by.id('field_skills'));

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

    async setPhoneNumberInput(phoneNumber) {
        await this.phoneNumberInput.sendKeys(phoneNumber);
    }

    async getPhoneNumberInput() {
        return this.phoneNumberInput.getAttribute('value');
    }

    async setLinkedInInput(linkedIn) {
        await this.linkedInInput.sendKeys(linkedIn);
    }

    async getLinkedInInput() {
        return this.linkedInInput.getAttribute('value');
    }

    async setFirstNameInput(firstName) {
        await this.firstNameInput.sendKeys(firstName);
    }

    async getFirstNameInput() {
        return this.firstNameInput.getAttribute('value');
    }

    async setLastNameInput(lastName) {
        await this.lastNameInput.sendKeys(lastName);
    }

    async getLastNameInput() {
        return this.lastNameInput.getAttribute('value');
    }

    async setEmailInput(email) {
        await this.emailInput.sendKeys(email);
    }

    async getEmailInput() {
        return this.emailInput.getAttribute('value');
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

    async skillsSelectLastOption() {
        await this.skillsSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async skillsSelectOption(option) {
        await this.skillsSelect.sendKeys(option);
    }

    getSkillsSelect(): ElementFinder {
        return this.skillsSelect;
    }

    async getSkillsSelectedOption() {
        return this.skillsSelect.element(by.css('option:checked')).getText();
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
