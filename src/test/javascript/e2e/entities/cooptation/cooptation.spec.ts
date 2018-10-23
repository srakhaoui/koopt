/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CooptationComponentsPage, CooptationDeleteDialog, CooptationUpdatePage } from './cooptation.page-object';

const expect = chai.expect;

describe('Cooptation e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let cooptationUpdatePage: CooptationUpdatePage;
    let cooptationComponentsPage: CooptationComponentsPage;
    let cooptationDeleteDialog: CooptationDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Cooptations', async () => {
        await navBarPage.goToEntity('cooptation');
        cooptationComponentsPage = new CooptationComponentsPage();
        expect(await cooptationComponentsPage.getTitle()).to.eq('Cooptations');
    });

    it('should load create Cooptation page', async () => {
        await cooptationComponentsPage.clickOnCreateButton();
        cooptationUpdatePage = new CooptationUpdatePage();
        expect(await cooptationUpdatePage.getPageTitle()).to.eq('Create or edit a Cooptation');
        await cooptationUpdatePage.cancel();
    });

    it('should create and save Cooptations', async () => {
        const nbButtonsBeforeCreate = await cooptationComponentsPage.countDeleteButtons();

        await cooptationComponentsPage.clickOnCreateButton();
        await promise.all([
            cooptationUpdatePage.setProfileInput('profile'),
            cooptationUpdatePage.setPerformedOnInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            cooptationUpdatePage.cooptedSelectLastOption(),
            cooptationUpdatePage.coopterSelectLastOption()
            // cooptationUpdatePage.skillsSelectLastOption(),
        ]);
        expect(await cooptationUpdatePage.getProfileInput()).to.eq('profile');
        expect(await cooptationUpdatePage.getPerformedOnInput()).to.contain('2001-01-01T02:30');
        await cooptationUpdatePage.save();
        expect(await cooptationUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await cooptationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Cooptation', async () => {
        const nbButtonsBeforeDelete = await cooptationComponentsPage.countDeleteButtons();
        await cooptationComponentsPage.clickOnLastDeleteButton();

        cooptationDeleteDialog = new CooptationDeleteDialog();
        expect(await cooptationDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Cooptation?');
        await cooptationDeleteDialog.clickOnConfirmButton();

        expect(await cooptationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
