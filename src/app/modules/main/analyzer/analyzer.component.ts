import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import TemplateService from 'src/app/core/services/template.service';

@Component({
    selector: 'app-analyzer',
    templateUrl: './analyzer.component.html',
    styleUrls: ['./analyzer.component.scss']
})
export default class AnalyzerComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = [
        'time',
        'speaker',
        'sentence'
    ];

    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    dataSourceRep: MatTableDataSource<any> = new MatTableDataSource();

    @ViewChild('subHeader')
    subHeader?: TemplateRef<any>;

    get form(): FormGroup {
        return this._form;
    }
    private _form: FormGroup;

    constructor(
        private _tplService: TemplateService,
        private _fb: FormBuilder
    ) {
        this._form = this._fb.group({
            agent: _fb.control(null),
            call: _fb.control({
                value: null,
                disabled: true
            })
        });
    }

    ngOnInit(): void {
        this.dataSource.data = MOCK_DATA();
        this.dataSourceRep.data = MOCK_DATA().slice(-25);
    }

    ngAfterViewInit(): void {
        this._tplService.register('subHeader', this.subHeader);
    }

    // TODO: Implement logic
}

const MOCK_DATA = () => {
    const DATA: any[] = [];
    const SPEAKERS: string[] = [
        'Harvey',
        'Luke',
        'Unknown'
    ];

    let currentTime = 30;

    for (let i = 0; i < 100; i++) {
        const min = Math.floor(currentTime / 60);
        const sec = Math.floor(currentTime - min * 60);

        DATA.push({
            time: `${('0' + min).slice(-2)}:${('0' + sec).slice(-2)}`,
            speaker: SPEAKERS[Math.floor(Math.random() * (SPEAKERS.length))],
            sentence: `This is a sample sentence #${i + 1}`
        });

        currentTime += (Math.random() *  10) + 5;
    }

    return DATA;
};
