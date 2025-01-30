import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { RelaysComponent } from './relays/relays.component';
import { RelaysCreateComponent } from './relays-create/relays-create.component';

export const routes: Routes = [
    {path: "map", component: MapComponent },
    {path: "relays", component: RelaysComponent},
    {path: "relays-create", component: RelaysCreateComponent}
    
];
