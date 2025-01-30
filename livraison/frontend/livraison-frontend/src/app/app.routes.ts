import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { RelaysComponent } from './relays/relays.component';

export const routes: Routes = [
    {path: "map", component: MapComponent },
    {path: "relays", component: RelaysComponent}
];
