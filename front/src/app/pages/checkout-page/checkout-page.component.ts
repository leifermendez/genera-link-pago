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
  private readonly STRIPE!: any;
  private elementStripe!: any;
  cardNumber: any;
  cardCvv: any;
  cardExp: any;
  form: FormGroup = new FormGroup({})
  id!: string;
  orderData!: any;
  cardHandlerCard = this.onChangeCard.bind(this);
  cardHandlerCvv = this.onChangeCvv.bind(this);
  cardHandlerExp = this.onChangeExp.bind(this);


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
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],

    })
    this.loadDetail();
    this.createStripeElement()
  }

  loadDetail(): void {
    this.restService.getOrderDetail(this.id).subscribe(({data}) => {
      this.orderData = data;
      if (!data) {
        this.toaster.open('🔴 Error con orden');
        this.form.disable()
      } else {
        if (data.status.includes('succe')) {
          this.toaster.open({
            text: '🔴 Error con orden',
            caption: 'Ya se ha pagado'
          });
        }
        this.form.patchValue({
          amount: data.amount
        })
      }

    })
  }

  private createStripeElement = () => {
    console.log(this.STRIPE)
    this.elementStripe = this.STRIPE.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap',
        },
      ],
    });

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
    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');
    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;
    this.cardNumber.addEventListener('change', this.cardHandlerCard);
    this.cardExp.addEventListener('change', this.cardHandlerExp);
    this.cardCvv.addEventListener('change', this.cardHandlerCvv);

  }

  onChangeCard({error}: any) {
    this.form.patchValue({cardNumber: !error});
    this.cd.detectChanges();
  }

  onChangeCvv({error}: any) {
    this.form.patchValue({cardCvv: !error});
    this.cd.detectChanges();
  }

  onChangeExp({error}: any) {
    this.form.patchValue({cardExp: !error});
    this.cd.detectChanges();
  }


  async initPay(): Promise<any> {
    try {
      this.form.disable();
      const {token} = await this.STRIPE.createToken(this.cardNumber)
      const {data} = await this.restService.sendPayment(token.id, this.id)
      this.STRIPE.handleCardPayment(data.client_secret)
        .then((res: any) => {
          this.toaster.open('Pago exitoso!')
        })
        .catch(() => {
          this.toaster.open('Error con el pago')
        })
    } catch (e) {
      this.toaster.open({text: 'Algo ocurrio mientras procesaba el pago', caption: 'ERROR', type: 'danger'})
    }

  }
}
