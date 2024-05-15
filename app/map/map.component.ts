import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  
  //setup the click listeners for each country and add a hover
  ngAfterViewInit() {
    const svgMap = document.getElementById('svgmap');
    if (svgMap) {
      const ap = svgMap.querySelectorAll('path');

      ap.forEach((path) => {
        path.classList.add('country');
        path.addEventListener('click', () => {
          this.country_search(path.getAttribute('id'));
        });
      });
    } else {
      console.error('No countries loaded from SVG;');
    }
  }
  constructor(private http: HttpClient) {}


  //text search api
  checkInput() {
    const inputElement = document.getElementById('cname') as HTMLInputElement;
    if (inputElement && inputElement.value.trim() !== '') {
      const countryName = inputElement.value.trim();

      const svgMap = document.getElementById('svgmap');
      if (svgMap) {
        const paths = svgMap.querySelectorAll('path');

        paths.forEach((path) => {
          if (
            countryName.toLowerCase() ==
            path.getAttribute('name')?.toLowerCase()
          ) {
            this.country_search(path.getAttribute('id'));
          }
        });
      }
    } else {
      console.log('No text entered or input element not found.');
    }
  }


  //search the api for the country id
  country_search(id: string | null) {
    this.http
      .get(`https://api.worldbank.org/v2/country/${id}?format=json`)
      .subscribe((response: any) => {
        const data = response[1][0];
        const cnameElement = document.getElementById('country_name');
        const capitalElement = document.getElementById('capital');
        const regionElement = document.getElementById('region');
        const incomeLevelElement = document.getElementById('income_level');
        const latitudeElement = document.getElementById('latitude');
        const longitudeElement = document.getElementById('longitude');
        if (
          cnameElement &&
          capitalElement &&
          regionElement &&
          incomeLevelElement &&
          latitudeElement &&
          longitudeElement
        ) {
          cnameElement.innerText = data.name || '';
          capitalElement.innerText = data.capitalCity || '';
          regionElement.innerText = data.region.value || '';
          incomeLevelElement.innerText = data.incomeLevel.value || '';
          latitudeElement.innerText = data.latitude || '';
          longitudeElement.innerText = data.longitude || '';
        } else {
          console.error('API error');
        }
      });
  }
}
