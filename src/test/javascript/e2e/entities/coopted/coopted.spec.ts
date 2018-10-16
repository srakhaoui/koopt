/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CooptedComponentsPage, CooptedDeleteDialog, CooptedUpdatePage } from './coopted.page-object';

const expect = chai.expect;

describe('Coopted e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let cooptedUpdatePage: CooptedUpdatePage;
    let cooptedComponentsPage: CooptedComponentsPage;
    let cooptedDeleteDialog: CooptedDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Coopteds', async () => {
        await navBarPage.goToEntity('coopted');
        cooptedComponentsPage = new CooptedComponentsPage();
        expect(await cooptedComponentsPage.getTitle()).to.eq('Coopteds');
    });

    it('should load create Coopted page', async () => {
        await cooptedComponentsPage.clickOnCreateButton();
        cooptedUpdatePage = new CooptedUpdatePage();
        expect(await cooptedUpdatePage.getPageTitle()).to.eq('Create or edit a Coopted');
        await cooptedUpdatePage.cancel();
    });

    it('should create and save Coopteds', async () => {
        const nbButtonsBeforeCreate = await cooptedComponentsPage.countDeleteButtons();

        await cooptedComponentsPage.clickOnCreateButton();
        await promise.all([
            cooptedUpdatePage.setPhoneNumberInput('phoneNumber'),
            cooptedUpdatePage.setLinkedInInput('linkedIn'),
            cooptedUpdatePage.userSelectLastOption()
        ]);
        expect(await cooptedUpdatePage.getPhoneNumberInput()).to.eq('phoneNumber');
        expect(await cooptedUpdatePage.getLinkedInInput()).to.eq('linkedIn');
        await cooptedUpdatePage.save();
        expect(await cooptedUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await cooptedComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Coopted', async () => {
        const nbButtonsBeforeDelete = await cooptedComponentsPage.countDeleteButtons();
        await cooptedComponentsPage.clickOnLastDeleteButton();

        cooptedDeleteDialog = new CooptedDeleteDialog();
        expect(await cooptedDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Coopted?');
        await cooptedDeleteDialog.clickOnConfirmButton();

        expect(await cooptedComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
