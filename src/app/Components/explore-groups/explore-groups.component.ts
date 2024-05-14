import { initMDB , Ripple} from 'mdb-ui-kit';
import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from '../../ApiServices/group.service';

initMDB({ Input, Ripple });
@Component({
  selector: 'app-explore-groups',
  templateUrl: './explore-groups.component.html',
  styleUrls: ['./explore-groups.component.css']
})


export class ExploreGroupsComponent implements OnInit {
  groups: any[] = []; 
  filteredGroups: any[] = []; 
  searchText = '';
 



  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getAllGroups(0, 25).subscribe(
      (response) => {
        this.groups = response.data.content; 
        console.log(this.groups);
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }
  searchGroups() {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredGroups = this.groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm) ||
      group.description.toLowerCase().includes(searchTerm)
    );
     console.log(this.filteredGroups);
     this.groups=this.filteredGroups;
  }

 
  }

