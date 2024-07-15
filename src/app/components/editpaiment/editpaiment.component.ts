import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaimentService } from 'src/app/services/paiment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editpaiment',
  templateUrl: './editpaiment.component.html',
  styleUrls: ['./editpaiment.component.css']
})
export class EditpaimentComponent implements OnInit {

  editfacturForm:FormGroup;
  id:any;
  paiment:any={};


  constructor( private paimentService:PaimentService,
    private activatedroute:ActivatedRoute,
    private formbuilder:FormBuilder) { }

  ngOnInit(): void {
    this.id=this.activatedroute.snapshot.paramMap.get("id");
    if(this.id){
      this.paimentService.getpaiment(this.id).subscribe(
        (data)=>{
          console.log(data);
          this.paiment=data.paiment;
      });
    }
        
        
    
     

      this.editfacturForm = this.formbuilder.group({


     
        date: [''],
        Price: [''],
        mode: [''],
        tranche: [''],
        Advance: [''],
        Rest: ['']
      
       
      
       
        
      
       
  
      })
  
     
      
    
     
      

        
      
    
    
  }

  editfactur(){
    Swal.fire({
      title: 'Souhaitez-vous enregistrer les modifications ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'enregistrer',
      denyButtonText: `Ne pas enregistrer`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.paimentService.updatepaiment(this.paiment).subscribe(
          (data)=>{
          console.log(data.message);
       });
        Swal.fire('enregistrer!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
      }
    })
    
    

    

  }

}
