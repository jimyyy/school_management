import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-listeleve',
  templateUrl: './listeleve.component.html',
  styleUrls: ['./listeleve.component.css']
})
export class ListeleveComponent implements OnInit {
  users: any;
  searchText: any;
  groups: any;
  groupForm: FormGroup;
  group: any = {};


  constructor(private userService: UserService, private router: Router, private groupService: GroupService,
    private formbuilder: FormBuilder) { }



  ngOnInit(): void {
    this.groupForm = this.formbuilder.group({

     
      idgroupe: [''],



    });

    this.groupService.getgroups().subscribe(
      (data) => {
        console.log(data.groups);
        this.groups = data.groups;



      });

    this.userService.getusers().subscribe(
      (data) => {
        console.log(data.users);
        this.users = data.users;



      });

    this.groupService.getgroups().subscribe(
      (data) => {
        console.log(data.groups);
        this.groups = data.groups;



      });
  }

  delete(id: any) {
    Swal.fire({
      title: 'Tu es sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteuser(id).subscribe(
          (data) => {
            console.log(data.message);
            this.userService.getusers().subscribe(
              (data) => {
                console.log(data.users);
                this.users = data.users;
              })
          })
        Swal.fire(
          ' supprimer!',
          'Votre fichier a été supprimé.',
          'success'
        )
      }
    })


   
  }



  add(id: any) {
    this.router.navigate([`addpaiment/${id}`]);

  }

  addgroupe(f,users) {
    Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'enregistrer',
      denyButtonText: `Ne pas enregistrer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userService.createaffect(f,users).subscribe(
          (data) => {
            console.log(data.message);
            
            
          });
        Swal.fire('enregistrer!', '', 'success')
        location.reload();
      } else if (result.isDenied) {
        Swal.fire(' Les modifications ne sont pas enregistrées', '', 'info')
      }
    })

    
    
    
   


  }
  
  
}






