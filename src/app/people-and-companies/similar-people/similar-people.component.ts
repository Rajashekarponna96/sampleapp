import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-similar-people',
  templateUrl: './similar-people.component.html',
  styleUrls: ['./similar-people.component.css']
})
export class SimilarPeopleComponent implements OnInit {


  @Input() similarPeople:any[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
