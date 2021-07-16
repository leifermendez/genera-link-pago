import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {WindowRef} from "../../WindowRef";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../../services/rest.service";
import {ActivatedRoute} from "@angular/router";
import {Toaster} from "ngx-toast-notifications";

declare global {
  interface Window {
    Stripe?: any;
  }
}

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  private readonly STRIPE!: any; //TODO: window.Stripe
  private elementStripe!: any;
  cardNumber: any;
  cardCvv: any;
  cardExp: any;
  form: FormGroup = new FormGroup({})
  id!: string;
  orderData!: any;

  constructor(private fb: FormBuilder,
              private toaster: Toaster,
              private cd: ChangeDetectorRef,
              private restService: RestService, private route: ActivatedRoute) {
    this.STRIPE = window.Stripe(environment.stripe_pk);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100000)]],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]], //TODO true | false
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],//TODO true | false
      cardExp: [false, [Validators.required, Validators.requiredTrue]],//TODO true | false
    })

    this.loadDetail();
    this.createStripeElement()
  }

  loadDetail(): void {
    this.restService.getOrderDetail(this.id).subscribe(({data}) => {
      this.orderData = data;
      if (data.status.includes('succe')) {
        this.form.disable()
        this.toaster.open({
          text: '🔴 Error con orden',
          caption: 'Ya se ha pagado'
        });
      }
      this.form.patchValue({
        amount: data.amount
      })
    })
  }

  private createStripeElement = () => {
    const style = {
      base: {
        color: '#000000',
        fontWeight: 400,
        fontFamily: '\'Poppins\', sans-serif',
        fontSize: '20px',
        '::placeholder': {
          color: '#E3E2EC',
        },
      },
      invalid: {
        color: '#dc3545',
      },
    };

    //TODO: SDK de Stripe inicia la generacion de elementos
    this.elementStripe = this.STRIPE.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap',
        },
      ],
    });

    //TODO: SDK Construimos los inputs de tarjeta, cvc, fecha con estilos
    const cardNumber = this.elementStripe.create('cardNumber', {
      placeholder: '4242 4242 4242 4242',
      style,
      classes: {
        base: 'input-stripe-custom'
      },
    });
    const cardExp = this.elementStripe.create('cardExpiry', {
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom'
      },
    });
    const cardCvc = this.elementStripe.create('cardCvc', {
      placeholder: '000',
      style,
      classes: {
        base: 'input-stripe-custom'
      },
    });

    //TODO: SDK Montamos los elementos en nuestros DIV identificados on el #id
    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');

    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;

    //TODO: Escuchamos los eventos del SDK
    this.cardNumber.addEventListener('change', this.onChangeCard.bind(this));
    this.cardExp.addEventListener('change', this.onChangeExp.bind(this));
    this.cardCvv.addEventListener('change', this.onChangeCvv.bind(this));

  }

  async initPay(): Promise<any> {
    try {
      this.form.disable();
      //TODO: SDK de Stripe genera un TOKEN para la intencion de pago!
      const {token} = await this.STRIPE.createToken(this.cardNumber)

      //TODO: Enviamos el token a nuesta api donde generamos (stripe) un metodo de pago basado en el token
      //TODO: tok_23213
      const {data} = await this.restService.sendPayment(token.id, this.id)

      //TODO: Nuestra api devolver un "client_secret" que es un token unico por intencion de pago
      //TODO: SDK de stripe se encarga de verificar si el banco necesita autorizar o no
      this.STRIPE.handleCardPayment(data.client_secret)
        .then(async () => {

          //TODO: 👌 Money Money!!!
          this.toaster.open({text: 'Dinerito dineron', caption: 'Yeah!', type: 'success'})

          //TODO: Enviamos el id "localizador" de nuestra orden para decirle al backend que confirme con stripe si es verdad!
          await this.restService.confirmOrder(this.id)
        })
        .catch(() => {
          this.toaster.open('Error con el pago')
        })
    } catch (e) {
      this.toaster.open({text: 'Algo ocurrio mientras procesaba el pago', caption: 'ERROR', type: 'danger'})
    }

  }

  //TODO: Manejadores de validacion de input de stripe

  onChangeCard({error}: any) {
    this.form.patchValue({cardNumber: !error});
  }

  onChangeCvv({error}: any) {
    this.form.patchValue({cardCvv: !error});
  }

  onChangeExp({error}: any) {
    this.form.patchValue({cardExp: !error});
  }


}
