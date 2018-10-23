/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SkillComponentsPage, SkillDeleteDialog, SkillUpdatePage } from './skill.page-object';

const expect = chai.expect;

describe('Skill e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let skillUpdatePage: SkillUpdatePage;
    let skillComponentsPage: SkillComponentsPage;
    let skillDeleteDialog: SkillDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Skills', async () => {
        await navBarPage.goToEntity('skill');
        skillComponentsPage = new SkillComponentsPage();
        expect(await skillComponentsPage.getTitle()).to.eq('Skills');
    });

    it('should load create Skill page', async () => {
        await skillComponentsPage.clickOnCreateButton();
        skillUpdatePage = new SkillUpdatePage();
        expect(await skillUpdatePage.getPageTitle()).to.eq('Create or edit a Skill');
        await skillUpdatePage.cancel();
    });

    it('should create and save Skills', async () => {
        const nbButtonsBeforeCreate = await skillComponentsPage.countDeleteButtons();

        await skillComponentsPage.clickOnCreateButton();
        await promise.all([
            skillUpdatePage.setCodeInput('code'),
            skillUpdatePage.setLabelInput('label'),
            skillUpdatePage.cooptationSelectLastOption()
        ]);
        expect(await skillUpdatePage.getCodeInput()).to.eq('code');
        expect(await skillUpdatePage.getLabelInput()).to.eq('label');
        await skillUpdatePage.save();
        expect(await skillUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await skillComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Skill', async () => {
        const nbButtonsBeforeDelete = await skillComponentsPage.countDeleteButtons();
        await skillComponentsPage.clickOnLastDeleteButton();

        skillDeleteDialog = new SkillDeleteDialog();
        expect(await skillDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Skill?');
        await skillDeleteDialog.clickOnConfirmButton();

        expect(await skillComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
