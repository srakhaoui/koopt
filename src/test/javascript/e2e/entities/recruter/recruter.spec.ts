/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RecruterComponentsPage, RecruterDeleteDialog, RecruterUpdatePage } from './recruter.page-object';

const expect = chai.expect;

describe('Recruter e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let recruterUpdatePage: RecruterUpdatePage;
    let recruterComponentsPage: RecruterComponentsPage;
    let recruterDeleteDialog: RecruterDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Recruters', async () => {
        await navBarPage.goToEntity('recruter');
        recruterComponentsPage = new RecruterComponentsPage();
        expect(await recruterComponentsPage.getTitle()).to.eq('Recruters');
    });

    it('should load create Recruter page', async () => {
        await recruterComponentsPage.clickOnCreateButton();
        recruterUpdatePage = new RecruterUpdatePage();
        expect(await recruterUpdatePage.getPageTitle()).to.eq('Create or edit a Recruter');
        await recruterUpdatePage.cancel();
    });

    it('should create and save Recruters', async () => {
        const nbButtonsBeforeCreate = await recruterComponentsPage.countDeleteButtons();

        await recruterComponentsPage.clickOnCreateButton();
        await promise.all([recruterUpdatePage.setPhoneNumberInput('phoneNumber'), recruterUpdatePage.userSelectLastOption()]);
        expect(await recruterUpdatePage.getPhoneNumberInput()).to.eq('phoneNumber');
        await recruterUpdatePage.save();
        expect(await recruterUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await recruterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Recruter', async () => {
        const nbButtonsBeforeDelete = await recruterComponentsPage.countDeleteButtons();
        await recruterComponentsPage.clickOnLastDeleteButton();

        recruterDeleteDialog = new RecruterDeleteDialog();
        expect(await recruterDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Recruter?');
        await recruterDeleteDialog.clickOnConfirmButton();

        expect(await recruterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
