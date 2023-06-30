import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { XetaproductsComponent } from './xetaproducts/xetaproducts.component';
import { PeopleAndCompaniesComponent } from './people-and-companies/people-and-companies.component';
import { ListViewPeopleComponent } from './people-and-companies/list-view-people/list-view-people.component';
import { BrowsePeopleComponent } from './people-and-companies/browse-people/browse-people.component';
import { BreadCrumbMenuPeopleComponent } from './people-and-companies/bread-crumb-menu-people/bread-crumb-menu-people.component';
import { NewViewPeopleComponent } from './people-and-companies/new-view-people/new-view-people.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import {ButtonModule} from 'primeng/button';
import {OrderListModule} from 'primeng/orderlist';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DataViewModule} from 'primeng/dataview';
import {PaginatorModule} from 'primeng/paginator';
import {KeyFilterModule} from 'primeng/keyfilter';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';

import { PersonalNameComponent } from './people-and-companies/personcomponents/personal-name/personal-name.component';
import { CompanyNameComponent } from './people-and-companies/personcomponents/company-name/company-name.component';
import { TelephoneComponent } from './people-and-companies/personcomponents/telephone/telephone.component';
import { EmailIDComponent } from './people-and-companies/personcomponents/email-id/email-id.component';
import { SimilarPeopleComponent } from './people-and-companies/similar-people/similar-people.component';
import { EntityComponent } from './entity/entity.component';

import { PartyAccountHeadsComponent } from './entity/party-account-heads/party-account-heads.component';
import { OtherAccountHeadsComponent } from './entity/other-account-heads/other-account-heads.component';

import { ItemsComponent } from './entity/items/items.component';
import { ListViewItemsComponent } from './entity/items/list-view-items/list-view-items.component';
import { NewViewItemsComponent } from './entity/items/new-view-items/new-view-items.component';
import { ControlAndAccountingComponent } from './control-and-accounting/control-and-accounting.component';
import { PurchasesComponent } from './control-and-accounting/purchases/purchases.component';
import { CalendarModule } from 'primeng/calendar';
import { DDMMYYYValidator } from './validators/ddmmyyyvalidator';
import { InputMaskModule } from "primeng/inputmask";
import { HHMMValidator } from './validators/hhmmvalidator';
import { PurchaseRegisterComponent } from './control-and-accounting/purchases/purchase-register/purchase-register.component';
import {DialogModule} from 'primeng/dialog';
import {InputSwitchModule} from 'primeng/inputswitch';
import { SalesComponent } from './control-and-accounting/sales/sales.component';
import {DropdownModule} from 'primeng/dropdown';
import { PaymentsComponent } from './control-and-accounting/payments/payments.component';
import { ReceiptsComponent } from './control-and-accounting/receipts/receipts.component';
import { WriteChequeComponent } from './entity/write-cheque/write-cheque.component';
import { ReceiveChequeComponent } from './entity/receive-cheque/receive-cheque.component';
import { BRSComponent } from './control-and-accounting/brs/brs.component';
import { ProductsComponent } from './products/products.component';
import {SidebarModule} from 'primeng/sidebar';
import { NewPeopleAndCompaniesComponent } from './new-people-and-companies/new-people-and-companies.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ChartModule} from 'primeng/chart';
import { SalesReturnComponent } from './control-and-accounting/sales-return/sales-return.component';
import { ReportsComponent } from './reports/reports.component';
import { FinalAccountsComponent } from './reports/final-accounts/final-accounts.component';
import { OrdersComponent } from './orders/orders.component';
import { TagsComponent } from './entity/tags/tags.component';
import { TasksComponent } from './tasks/tasks.component';
import { DayTasksComponent } from './tasks/day-tasks/day-tasks.component';
import { ConsumptionComponent } from './control-and-accounting/consumption/consumption.component';
import { ProductionComponent } from './control-and-accounting/production/production.component';
import { StockBalanceRegisterComponent } from './reports/stock-balance-register/stock-balance-register.component';
import { ReplaceZeroWithEmptyPipe } from './pipes/replace-zero-with-empty.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LineProductionComponent } from './control-and-accounting/line-production/line-production.component';
import { JournalVoucherComponent } from './control-and-accounting/journal-voucher/journal-voucher.component';
import { UOMSComponent } from './entity/uoms/uoms.component';
import { ClassificationComponent } from './reports/classification/classification.component';
import { PurchaseReturnComponent } from './control-and-accounting/purchase-return/purchase-return.component';
import { TrailingFinalAccountsComponent } from './reports/trailing-final-accounts/trailing-final-accounts.component';
import { FinalAccountsSimpleComponent } from './reports/final-accounts-simple/final-accounts-simple.component';
import { ProfileComponent } from './entity/profile/profile.component';
import { RecipeCostListComponent } from './reports/recipe-cost-list/recipe-cost-list.component';
import { NewFinalAccountsComponent } from './reports/new-final-accounts/new-final-accounts.component';
import { ClosingStockComponent } from './reports/closing-stock/closing-stock.component';
import { ReplaceZeroWithEmptyForCSPipe } from './pipes/replace-zero-with-empty-for-cs.pipe';
import { GeneralLedgerComponent } from './reports/general-ledger/general-ledger.component';
import { MilkSupplyTaskSheetComponent } from './tasks/milk-supply-task-sheet/milk-supply-task-sheet.component';
import { XetaSetupComponent } from './xeta-setup/xeta-setup.component';
import { EquityPayableComponent } from './entity/equity-payable/equity-payable.component';
import { OpeningBalancesComponent } from './entity/opening-balances/opening-balances.component';
import { PostalAddressComponent } from './people-and-companies/personcomponents/postal-address/postal-address.component';
import { GovtIDComponent } from './people-and-companies/personcomponents/govt-id/govt-id.component';
import { FreshPeopleAndCompaniesComponent } from './people-and-companies/fresh-people-and-companies/fresh-people-and-companies.component';
import { SaleInvoiceAgeingListComponent } from './reports/sale-invoice-ageing-list/sale-invoice-ageing-list.component';
import { PurchaseInvoiceAgeingListComponent } from './reports/purchase-invoice-ageing-list/purchase-invoice-ageing-list.component';
import { ItemLevelsComponent } from './entity/item-levels/item-levels.component';
import { NewJournalVoucherComponent } from './control-and-accounting/new-journal-voucher/new-journal-voucher.component';
import { TransferComponent } from './control-and-accounting/transfer/transfer.component';
import { StockLocationsComponent } from './entity/stock-locations/stock-locations.component';
import { PenultimateFinalAccountsComponent } from './reports/penultimate-final-accounts/penultimate-final-accounts.component';
import { ResourceTrackerComponent } from './reports/resource-tracker/resource-tracker.component';
import { NewviewComponent } from './newview/newview.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    XetaproductsComponent,
    PeopleAndCompaniesComponent,
    ListViewPeopleComponent,
    BrowsePeopleComponent,
    BreadCrumbMenuPeopleComponent,
    NewViewPeopleComponent,
    PersonalNameComponent,
    CompanyNameComponent,
    TelephoneComponent,
    EmailIDComponent,
    SimilarPeopleComponent,
    EntityComponent,
    PartyAccountHeadsComponent,
    OtherAccountHeadsComponent,
    ItemsComponent,
    ListViewItemsComponent,
    NewViewItemsComponent,
    ControlAndAccountingComponent,
    PurchasesComponent,
    DDMMYYYValidator,
    HHMMValidator,
    PurchaseRegisterComponent,
    SalesComponent,
    PaymentsComponent,
    ReceiptsComponent,
    WriteChequeComponent,
    ReceiveChequeComponent,
    BRSComponent,
    ProductsComponent,
    NewPeopleAndCompaniesComponent,
    DashboardComponent,
    SalesReturnComponent,
    ReportsComponent,
    FinalAccountsComponent,
    OrdersComponent,
    TagsComponent,
    TasksComponent,
    DayTasksComponent,
    ConsumptionComponent,
    ProductionComponent,
    StockBalanceRegisterComponent,
    ReplaceZeroWithEmptyPipe,
    LineProductionComponent,
    JournalVoucherComponent,
    UOMSComponent,
    ClassificationComponent,
    PurchaseReturnComponent,
    TrailingFinalAccountsComponent,
    FinalAccountsSimpleComponent,
    ProfileComponent,
    RecipeCostListComponent,
    NewFinalAccountsComponent,
    ClosingStockComponent,
    ReplaceZeroWithEmptyForCSPipe,
    GeneralLedgerComponent,
    MilkSupplyTaskSheetComponent,
    XetaSetupComponent,
    EquityPayableComponent,
    OpeningBalancesComponent,
    PostalAddressComponent,
    GovtIDComponent,
    FreshPeopleAndCompaniesComponent,
    SaleInvoiceAgeingListComponent,
    PurchaseInvoiceAgeingListComponent,
    ItemLevelsComponent,
    NewJournalVoucherComponent,
    TransferComponent,
    StockLocationsComponent,
    PenultimateFinalAccountsComponent,
    ResourceTrackerComponent,
    NewviewComponent
    
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,HttpClientModule,FormsModule,
    ReactiveFormsModule,AutoCompleteModule,ButtonModule,OrderListModule,
    RadioButtonModule,InputTextModule,CardModule,BreadcrumbModule,
    ProgressSpinnerModule,DataViewModule,PaginatorModule,KeyFilterModule,
    TableModule,ConfirmDialogModule,CheckboxModule,CalendarModule,InputMaskModule,
    DialogModule,InputSwitchModule,DropdownModule,SidebarModule,ChartModule,InputTextareaModule
  ],
  providers: [DatePipe,DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
