import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import agentsMockData from '../../../../assets/agents-mock-data.json';
import callsMockData from '../../../../assets/calls-mock-data.json';
import transcriptMockData from '../../../../assets/transcript-mock-data.json';

import TemplateService from 'src/app/core/services/template.service';
import { MatSelectChange } from '@angular/material/select';

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
    agentsData:any[] = [];
    callsData:any[] = [];
    transcriptData:any[] = [];
    emptyState = true;
    matchingTranscriptOrder: number | null = null;
    matchingScriptOrder: number | null = null;
    transcriptsRatio = 0;
    scriptsRatio = 0;
    @ViewChild('subHeader')
    subHeader?: TemplateRef<any>;
    selectedTransactionData: any;

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
            }),
            sensitivity: _fb.control({
                value: 38,
                disabled: true
            })
        });
    }

    ngOnInit(): void {
        this.agentsData = agentsMockData;

    }

    ngAfterViewInit(): void {
        this._tplService.register('subHeader', this.subHeader);
    }

    handleAgentChange(event: MatSelectChange): void {
        this.dataSource.data = [];
        this.dataSourceRep.data = [];
        this.emptyState = true;
        if (event.value) {
            this.callsData = callsMockData
                .filter(call => call.agent[0].agent_id === event.value)
                .map(call => ({...call, call_start_time: new Date(call.call_start_time).toLocaleDateString().split('/').join('.')}));
            this._form.get('call')?.enable();
            this._form.get('call')?.reset();
            
        } else {
            this._form.get('call')?.disable();
        }
    }
    handleCallChange(event: MatSelectChange): void {
        this.selectedTransactionData = [transcriptMockData].find(data => data.call_id === this._form.get('call')?.value);
        if (event.value) {
            this.transcriptData = [transcriptMockData].filter(trans => trans.call_id === event.value);
            this._form.get('call')?.enable();
            this._form.get('sensitivity')?.enable();
            this._form.get('sensitivity')?.setValue(38);
            this.dataSource.data = this.getTranscriptData();
            this.dataSourceRep.data = this.getScriptData();
            this.emptyState = false;
            this.getTranscriptsRatio();
            this.getScriptsRatio();
        } else {
            this._form.get('call')?.disable();
            this._form.get('sensitivity')?.disable();
            this.emptyState = true;
        }
    }
    onSliderChange(event: any) {
        this._form.patchValue({ 'sensitivity': event.value });
        this.getTranscriptsRatio();
        this.getScriptsRatio();
    }

    // TODO: Implement logic
    getSpeaker(code: number) {
        if (code === 1) {
            const agentId = transcriptMockData.agent[0].agent_id;
            return agentsMockData.find(agent => agent.agent_id === agentId)?.full_name;
        } else if(code === 2) {
            return transcriptMockData.customer[0].full_name;
        }
        else return 'unknown';
    }

    getTranscriptData = () => {
        return this.selectedTransactionData?.transcript?.map((value: any) => 
            ({  ...value,
                time: new Date(value.timeFrom * 1000).getMinutes().toString().padStart(2, '0') + ': ' + new Date(value.timeFrom * 1000).getSeconds().toString().padStart(2, '0'),
                speaker: this.getSpeaker(value.channel),
                matching_line: transcriptMockData.script.find(script => script.matching_sentence === value.sentence)?.order as number + 1
            })
        )
    }

    getScriptData = () => {
        return this.selectedTransactionData?.script?.map((value: any) => 
            ({
                ...value,
                matching_line: transcriptMockData.transcript.find(script => script.matching_sentence === value.sentence)?.order as number + 1
            })
        )
    }

    highlightTranscript = (data: typeof transcriptMockData.transcript[0]) => {
        if (this.form.get('sensitivity')?.value <= data.similarity * 100) {
            this.matchingTranscriptOrder = transcriptMockData.script.find(script => script.matching_sentence === data.sentence)?.order as number + 1;
        }
    }

    highlightScript = (data: typeof transcriptMockData.script[0]) => {
        if (this.form.get('sensitivity')?.value <= data.similarity * 100) {
            this.matchingScriptOrder = transcriptMockData.transcript.find(script => script.sentence === data.matching_sentence)?.order as number + 1;
        }
    }

    resetHighlights() {
        this.matchingScriptOrder = null;
        this.matchingTranscriptOrder = null;
    }

    getTranscriptsRatio() {
        const totalTranscripts = this.selectedTransactionData.transcript.length;
        const similarityTranscripts = this.selectedTransactionData.transcript.filter((transcript: any) => (transcript.similarity * 100)>=this.form.get('sensitivity')?.value).length;
        this.transcriptsRatio = similarityTranscripts/totalTranscripts;
    }

    getScriptsRatio() {
        const totalScripts = this.selectedTransactionData.script.length;
        const similarityScripts = this.selectedTransactionData.script.filter((transcript: any) => (transcript.similarity * 100)>=this.form.get('sensitivity')?.value).length;
        this.scriptsRatio = similarityScripts/totalScripts;
    }
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
