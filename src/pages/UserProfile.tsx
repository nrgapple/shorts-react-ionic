import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonButton, IonIcon, IonSelectOption, IonList, IonItem, IonLabel, IonSelect, IonPopover, IonProgressBar, IonText, IonInput, IonRow, IonCol, IonTextarea, IonToast, IonFab, IonFabButton, IonCard } from '@ionic/react';
import './UserProfile.scss';
import { calendar, pin, more, body, close } from 'ionicons/icons';
import { Profile } from '../models/Profile';
import { Image } from "../models/Image";
import { connect } from '../data/connect';
import EditPopover from '../components/EditPopover';
import Axios from 'axios';
import { setUserProfile, loadProfile, loadNearMe, setHasValidProfile } from '../data/sessions/sessions.actions';
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { postImage, postProfileInfo } from '../data/dataApi';
import Lightbox from 'react-image-lightbox';
import ImageCard from '../components/ImageCard';
const apiURL = 'https://doctornelson.herokuapp.com';

interface OwnProps { 
  userProfile?: Profile;
  token?: string;
};

interface StateProps {
  loading?: boolean;
  isloggedin: boolean;
};

interface DispatchProps {
  loadProfile: typeof loadProfile,
  loadNearMe: typeof loadNearMe,
  setHasValidProfile: typeof setHasValidProfile,
};

interface UserProfileProps extends OwnProps, StateProps, DispatchProps {};

const About: React.FC<UserProfileProps> = ({ 
  userProfile, 
  loading, 
  token, 
  loadProfile, 
  isloggedin,
  setHasValidProfile,
}) => {
  const [about, setAbout] = useState(userProfile && userProfile.about? userProfile.about: 'empty');
  const [height, setHeight] = useState(userProfile && userProfile.height? userProfile.height: 0);
  const [gender, setGender] = useState(userProfile && userProfile.gender? userProfile.gender: 'male');
  const [genderPref, setGenderPref] = useState(userProfile && userProfile.genderPref? userProfile.genderPref: 'male');
  const [distance, setDistance] = useState(userProfile && userProfile.searchMiles? userProfile.searchMiles: -1);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState();
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState(userProfile && userProfile.images?userProfile.images: [])
  const [inputImage, setInputImage] = useState<File | undefined>(undefined);
  const [showImage, setShowImage] = useState(false);
  const [bigImage, setBigImage] = useState<string | undefined>(undefined);

  const presentPopover = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setShowPopover(true);
  };

  const calculateAge = (dob: Date) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age;
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.trace('updating profile submit');
    try {
      const updatedProfile = await postProfileInfo(
        token,
        about,
        gender,
        genderPref,
        height,
        distance,
      ) as Profile;
      console.log(updatedProfile);
      setUserProfile(updatedProfile);
      setHasValidProfile(true);
      setIsEditing(false);
      setToastText('Profile Updated Successfully');
      setShowToast(true);
    } catch (e) {
      const { data } = await e.response;
      console.error(`Error updating profile`);
      console.error(data);
      setToastText('Error Updating Profile');
      setShowToast(true);
    }
  }

  const uploadImage = async () => {
    if (inputImage) {
      try {
        const imageInfo = await postImage(inputImage, token);
        if (imageInfo)
        {
          setImages([...images, imageInfo]);
          setToastText('Image Uploaded Successfully');
          setShowToast(true);
        }
      } catch (e) {
        console.log(`Error uploading image: ${e}`);
      }
    } else {
      console.log(`No image to upload`);
    }
  }

  const removeImage = async (imageId: number | undefined) => {
    console.log(`Remove image: ${imageId}`);
    if (!imageId) {
      return;
    }
    try {
      const index = images.findIndex(x => x.imageId === imageId);
      console.log(images.length);
      images.length < 2?
      setImages(oldImages => [] as Image[]):
      setImages(oldImages => [...oldImages.slice(0, index),...oldImages.slice(index + 1)]);
      console.log(images);
      setToastText('Image removed successfully');
      setShowToast(true);
    } catch (e) {
      console.log(`There was an issue deleting the image`);
    }
  }

  const handeChange = (event: any) => {
    const file = event.target.files[0] as File;
    setInputImage(file);
  }

  const setValues = () => {
    console.log('currentUserProfile');
    console.log(userProfile);
    setAbout(userProfile && userProfile.about? userProfile.about: 'empty');
    setHeight(userProfile && userProfile.height? userProfile.height: 0);
    setGenderPref(userProfile && userProfile.genderPref? userProfile.genderPref: 'male');
    setGender(userProfile && userProfile.gender? userProfile.gender: 'male');
    setImages(userProfile && userProfile.images?userProfile.images: []);
    setDistance(userProfile && userProfile.searchMiles? userProfile.searchMiles: 10);
    defineCustomElements(window);
  }

  useEffect(() => {
    console.log('userProfile updated');
    setValues();
  }, [userProfile])

  useEffect(() => {
    console.log('start about');
    try {
      console.log(`token ${token}`)
      loadProfile(token);
    } catch (e) {
      console.log(`Error loading the user profile ${e}`);
    }
    
  }, []);

  return (
    <IonPage id="about-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">
            {
              !isEditing?
              <IonButton icon-only onClick={presentPopover}>
                <IonIcon slot="icon-only" icon={more}></IonIcon>
              </IonButton>
              :
              <></>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {
        isloggedin ? (
          <IonContent>
            {
              loading ? 
              <IonProgressBar type="indeterminate"></IonProgressBar>
              :
              <>
              <IonRow>
                <IonCol size="12">
                  <ImageCard 
                    images={images}
                    areDeletable={isEditing}
                    onDelete={removeImage}
                  />

                </IonCol>
                {
                  isEditing && (
                    <>
                    <IonCol size="12" size-md="6">
                      <IonCard>
                        <input type="file" accept="image/png, image/jpeg" name="image-upload" onChange={handeChange}></input>
                        {
                          inputImage && (
                            <IonButton onClick={uploadImage}>
                              Upload
                            </IonButton>
                          )
                        }
                      </IonCard>
                    </IonCol>
                    </>
                  )
                }
              </IonRow>
              <div className="about-info">
                <h4 className="ion-padding-start">
                  {userProfile? `${userProfile.firstName} ${userProfile.lastName}`: 'No Profile'}
                </h4>
                <form noValidate onSubmit={updateProfile}>
                <IonList lines="none">
                  <IonItem>
                    <IonIcon icon={calendar} slot="start"></IonIcon>
                    <IonLabel position="stacked">Age</IonLabel>
                    <IonText>
                      {userProfile? calculateAge(userProfile.dob) : 'N/A'}
                    </IonText> 
                  </IonItem>
    
                  <IonItem>
                    <IonIcon icon={body} slot="start"></IonIcon>
                    <IonLabel position="stacked">Height</IonLabel>
                    <IonInput disabled={!isEditing} type="number" value={height.toString()} onIonChange={e => setHeight(Number.parseInt(e.detail.value? e.detail.value : '0'))}>
                    </IonInput>
                  </IonItem>
                  
                  <IonItem>
                    <IonIcon icon={body} slot="start"></IonIcon>
                    <IonLabel position="stacked">Gender</IonLabel>
                    <IonSelect value={gender} onIonChange={e => setGender(e.detail.value)} disabled={!isEditing}>
                      <IonSelectOption value="female">Female</IonSelectOption>
                      <IonSelectOption value="male">Male</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  
                  <IonItem>
                    <IonIcon icon={body} slot="start"></IonIcon>
                    <IonLabel position="stacked">Gender Preference</IonLabel>
                    <IonSelect value={genderPref} onIonChange={e => setGenderPref(e.detail.value)} disabled={!isEditing}>
                      <IonSelectOption value="female">Female</IonSelectOption>
                      <IonSelectOption value="male">Male</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                    
                  <IonItem>
                    <IonIcon icon={pin} slot="start"></IonIcon>
                    <IonLabel position="stacked">Location</IonLabel>
                    <IonText>{userProfile&&userProfile.displayAddress?userProfile.displayAddress: "No Location Data"}</IonText>
                  </IonItem>

                  <IonItem>
                    <IonIcon icon={body} slot="start"></IonIcon>
                    <IonLabel position="stacked">Distance</IonLabel>
                    <IonSelect value={distance} onIonChange={e => setDistance(e.detail.value)} disabled={!isEditing}>
                      <IonSelectOption value={1} >10 miles</IonSelectOption>
                      <IonSelectOption value={20} >20 miles</IonSelectOption>
                      <IonSelectOption value={50} >50 miles</IonSelectOption>
                      <IonSelectOption value={100} >100 miles</IonSelectOption>
                      <IonSelectOption value={500} >500 miles</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">About</IonLabel>
                      <IonTextarea value={about} disabled={!isEditing} onIonChange={e=> setAbout(e.detail.value!)} autoGrow spellCheck={true}></IonTextarea>
                  </IonItem>
                </IonList>
                
                {
                  isEditing ?
                  <IonRow>
                    <IonCol>
                      <IonButton type="submit" expand="block">Update</IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton onClick={() => {setIsEditing(false);}} color="light" expand="block">Cancel</IonButton>
                    </IonCol>
                  </IonRow>
                  :
                <></>
                }
                </form>
              </div>
              
              </>
            }
          </IonContent>
        ) : (
          <IonContent>
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonButton expand="block" routerLink={"/Login"}>
                    <IonText>
                      Please Login
                    </IonText>
                  </IonButton>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonContent>
        )
      }
      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowPopover(false)}
      >
        <EditPopover edit={() => {
              setIsEditing(true); 
              setShowPopover(false);
            }
          }
        /> 
      </IonPopover>
      <IonToast
        isOpen={showToast}
        duration={3000}
        message={toastText}
        onDidDismiss={() => setShowToast(false)} />
      {
        showImage && (
          <Lightbox
            mainSrc={bigImage?bigImage:''}
            onCloseRequest={() => setShowImage(false)}
          />
        )
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    userProfile: state.data.userProfile,
    loading: state.data.loading,
    token: state.user.token,
    isloggedin: state.user.isLoggedin,
  }),
  mapDispatchToProps: {
    loadProfile,
    loadNearMe,
    setHasValidProfile,
  },
  component: About
});