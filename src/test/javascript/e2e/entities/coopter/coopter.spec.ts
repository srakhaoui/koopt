/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CoopterComponentsPage, CoopterDeleteDialog, CoopterUpdatePage } from './coopter.page-object';

const expect = chai.expect;

describe('Coopter e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let coopterUpdatePage: CoopterUpdatePage;
    let coopterComponentsPage: CoopterComponentsPage;
    let coopterDeleteDialog: CoopterDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Coopters', async () => {
        await navBarPage.goToEntity('coopter');
        coopterComponentsPage = new CoopterComponentsPage();
        expect(await coopterComponentsPage.getTitle()).to.eq('Coopters');
    });

    it('should load create Coopter page', async () => {
        await coopterComponentsPage.clickOnCreateButton();
        coopterUpdatePage = new CoopterUpdatePage();
        expect(await coopterUpdatePage.getPageTitle()).to.eq('Create or edit a Coopter');
        await coopterUpdatePage.cancel();
    });

    it('should create and save Coopters', async () => {
        const nbButtonsBeforeCreate = await coopterComponentsPage.countDeleteButtons();

        await coopterComponentsPage.clickOnCreateButton();
        await promise.all([coopterUpdatePage.setPhoneNumberInput('phoneNumber'), coopterUpdatePage.userSelectLastOption()]);
        expect(await coopterUpdatePage.getPhoneNumberInput()).to.eq('phoneNumber');
        await coopterUpdatePage.save();
        expect(await coopterUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await coopterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Coopter', async () => {
        const nbButtonsBeforeDelete = await coopterComponentsPage.countDeleteButtons();
        await coopterComponentsPage.clickOnLastDeleteButton();

        coopterDeleteDialog = new CoopterDeleteDialog();
        expect(await coopterDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Coopter?');
        await coopterDeleteDialog.clickOnConfirmButton();

        expect(await coopterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
