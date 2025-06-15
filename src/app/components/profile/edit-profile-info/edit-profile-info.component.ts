import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {UserProfileService} from '../../../services/user-profile.service';
import {ServiceResultDto} from '../../../dto/serviceResultDto';
import {FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from '@angular/forms';
import {UserProfileDto} from '../../../dto/userProfileDto';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import isEqual from 'lodash/isEqual';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-edit-profile-info',
  imports: [
    Dialog,
    InputText,
    Button,
    ReactiveFormsModule,
    Select,
    DatePicker
  ],
  templateUrl: './edit-profile-info.component.html',
  styleUrl: './edit-profile-info.component.less'
})
export class EditProfileInfoComponent implements OnInit, OnChanges {
  @Input({required: true}) visible = false;
  @Input({required: true}) userId: string = '';
  @Input({required: true}) userProfile: UserProfileDto = new UserProfileDto();
  @Output() onSaved = new EventEmitter<void>();
  @Output() onCancelClicked = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  isLoading =  false;
  editForm!: UntypedFormGroup;
  genders = [{id:0, name:'Male'}, {id: 1,name:'Female'}];
  initialUserProfile!: UserProfileDto;

  constructor(
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly userProfileService: UserProfileService) {}

  ngOnInit() {
    this.initialUserProfile = structuredClone(this.userProfile);

    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['userProfile']
      || !changes['userProfile'].currentValue)
      return;

    if (!this.editForm) {
      this.initializeForm();
    }

    const newUserProfile = {
      ...changes['userProfile'].currentValue,
      birthDate: new Date(changes['userProfile'].currentValue['birthDate'])
    };

    this.initialUserProfile = structuredClone(newUserProfile);
    this.editForm.setValue(newUserProfile);
  }

  formChanged(): boolean {
    const current = this.editForm.getRawValue();
    return !isEqual(current, this.initialUserProfile);
  }

  onSaveClick() {
    this.userProfileService.editUserProfile(this.userId,
      {
        ...this.editForm.value,
        birthDate: (this.editForm.value.birthDate as Date).toISOString().split('T')[0]
      }).subscribe({
        next: () => {
          this.onSaved.emit();
          this.closeDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User profile has successfully been updated!'
          });
        },
        error: (err: ServiceResultDto) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Something went wrong',
            detail: 'Failed to save the user profile!'
          });
        }
      });
  }

  onCancelClick() {
    this.closeDialog();
    this.onCancelClicked.emit();
  }

  closeDialog() {
    this.editForm.setValue(this.initialUserProfile);
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  private initializeForm() {
    this.editForm = this.fb.group({
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      firstName: [this.userProfile.firstName, [Validators.required, Validators.minLength(6)]],
      lastName: [this.userProfile.lastName, [Validators.required, Validators.minLength(6)]],
      middleName: [this.userProfile.middleName, [Validators.minLength(6)]],
      gender: [this.userProfile.gender, [Validators.required]],
      phoneNumber: [this.userProfile.phoneNumber, [Validators.required, Validators.minLength(6)]],
      birthDate: [new Date(this.userProfile.birthDate), [Validators.required]],
    });
  }
}
