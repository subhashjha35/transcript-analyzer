import { PieChartComponent } from '../../../core/components/pie-chart/pie-chart.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';

import { CoreModule } from 'src/app/core/core.module';

import AnalyzerComponent from './analyzer.component';
import { ROUTES } from './analyzer.routes';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [
        AnalyzerComponent,
        PieChartComponent
    ],
    imports: [
        CoreModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatTooltipModule,
        MatSliderModule,
        ChartsModule,

    ],
    bootstrap: [AnalyzerComponent]
})
export class AnalyzerModule {}
