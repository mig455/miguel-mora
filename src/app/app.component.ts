import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AppService } from './app.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('GenInput') GenInput!: ElementRef<HTMLInputElement>;
  constructor( private _AppService:AppService){
    this.FilteredGen = this.genCntrl.valueChanges.pipe(
      startWith(null),
      map((gener: string | null) => (gener ? this._filter(gener) : this.Generos.slice())),
    );
  }
  public Peliculas:Array<any>=[]
  public Generos:Array<string>=[]
  displayedColumns: string[] = ['nombre', 'descripcion', 'genero'];
  dataSource =new MatTableDataSource();
  public Filtertitle=''
  public FilterDescripcion=''
  genCntrl = new FormControl('');
  FilteredGen!: Observable<string[]>;
  FilterGenero: string[] = [];
  announcer = inject(LiveAnnouncer);
  ngOnInit(): void {
    this.GetData()
  }
  GetData(){
    this._AppService.GetData().then((res:any) => {
      this.Peliculas=res.data.movies
      this.dataSource=new MatTableDataSource(this.Peliculas.map(e=>{
        return{
          ...e,
          visible:true
        }
      }))
      this.Generos=res.data.genres
      console.log(this.dataSource)
    })
    .catch(err => console.log(err))
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.FilterGenero.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.genCntrl.setValue(null);
  }

  remove(gener: string): void {
    const index = this.FilterGenero.indexOf(gener);

    if (index >= 0) {
      this.FilterGenero.splice(index, 1);

      this.announcer.announce(`Removed ${gener}`);
    }
    this.Filter()
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    var existe=this.FilterGenero.find(e=>e==event.option.viewValue)
    console.log(existe)
    if(existe==undefined){
      this.FilterGenero.push(event.option.viewValue);
      this.GenInput.nativeElement.value = '';
      this.genCntrl.setValue(null);
      this.Filter()
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.Generos.filter(gen => gen.toLowerCase().includes(filterValue));
  }
  Filter(){
    console.log(this.FilterGenero)
    var data:Array<any>=this.Peliculas
    if(this.Filtertitle.length>0){
      data=this.Peliculas.filter(p => p.title.toLowerCase().includes(this.Filtertitle))
    }
    if(this.FilterDescripcion.length>0){
      data=data.filter(d => d.description.toLowerCase().includes(this.FilterDescripcion))
    }
    if(this.FilterGenero.length>0){
      data=data.filter(d => this.FilterGenero.find(e=>e==d.genre))
    }
    this.dataSource=new MatTableDataSource(data)
  }
}
