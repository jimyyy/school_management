import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-gestioneleve',
  templateUrl: './gestioneleve.component.html',
  styleUrls: ['./gestioneleve.component.css']
})
export class GestioneleveComponent implements OnInit {
  users: any;
  searchText: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getusers().subscribe(
      (data) => { //data howa retour taa requete//
        console.log(data.users);
        this.users = data.users;





      })
  }

  delete(id: any) {
    Swal.fire({
      title: 'Tu es  sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
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
          'Supprimé!',
          
     'Votre fichier a été supprimé',
          'success'
        )
      }
    })








  }

  accepte(users) {

    Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'enregistrer',
      denyButtonText: `Ne pas enregistrer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        users.type = "studentbyadmin";
        this.userService.updatetype(users).subscribe(
          (data) => {
            console.log(data.message);

          }
        )
        Swal.fire('enregistrer!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
      }
    })











  }

  refuseeleve(users) {

    Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'enregistrer',
      denyButtonText: `Ne pas enregistrer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        users.status = "Réfuser";
        this.userService.updatestatus(users).subscribe(
          (data) => {
            console.log(data.message);

          }
        )
        Swal.fire('enregistrer!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
      }
    })



  }

  open(img){
    window.open(img);
  }




}
