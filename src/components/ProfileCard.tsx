import React, { useState, useRef, useEffect } from 'react';
import { IonCard, IonCardHeader, IonItem, IonCardContent, IonList, IonRow, IonCol, IonButton, IonIcon, IonLabel, IonSkeletonText, IonCardTitle, IonChip, IonSlides, IonSlide, IonText } from '@ionic/react';
import { calendar, body, close, heart } from 'ionicons/icons';
import { Profile } from '../models/Profile';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import ImageCard from './ImageCard';
import { useHistory } from 'react-router';
import { findHeightString } from '../util/util';

interface ProfileCardProps {
  profile?: Profile;
  swiped: (liked: boolean) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, swiped }) => {
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

  const [showImage, setShowImage] = useState(false);
  const [bigImage, setBigImage] = useState<string | undefined>(undefined);
  const slides = useRef<HTMLIonSlidesElement>(null);
  const history = useHistory();

  useEffect(() => {
    if (profile && slides.current) {
      (async () => {
        if (!slides.current)
          return;
        await slides.current.update();
      })();
    }
  }, [profile])

  return (
    <>
      {
        profile ?
          <>
            <IonCol size="12" size-md="6">
            <IonCard className="home-card">
              <img
                src={profile.images[0].imageUrl}
                alt="no img"
                style={{
                  height: "100%",
                  width: "100%",
                }}
                onClick={() => {
                    history.push(`/more/${profile.userId}`)
                  }
                }
              />
              </IonCard>
            </IonCol>
            <IonCol size="12" size-md="6">
              <IonCard className="home-card">
                <IonItem lines="none">
                  <IonLabel><h1><span>{profile.firstName}&nbsp;&nbsp;&nbsp;</span >
                    <span>
                      <IonChip color="primary" outline>
                        <IonIcon icon={calendar} />
                        <IonLabel>
                          {calculateAge(profile.dob)}
                        </IonLabel>
                      </IonChip>
                      <IonChip color="secondary" outline>
                        <IonIcon icon={body} />
                        <IonLabel>
                          {findHeightString(profile.height!)}
                        </IonLabel>
                      </IonChip>
                    </span>
                    </h1>
                  </IonLabel>
                </IonItem>
                
                <IonRow justify-content-center>
                  <IonCol text-center size="6">
                    <IonButton
                      fill="solid"
                      size="small"
                      color="danger"
                      expand="block"
                      onClick={() => swiped(false)}
                    >
                      <IonIcon slot="start" icon={close} />
                    Pass
                </IonButton>
                  </IonCol>
                  <IonCol text-center size="6">
                    <IonButton
                      fill="solid"
                      size="small"
                      color="success"
                      expand="block"
                      onClick={() => swiped(true)}>
                      <IonIcon slot="start" icon={heart} />
                    Like
                </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton expand="block" routerLink={`/more/${profile.userId}`} >
                      Profile
                  </IonButton>
                  </IonCol>
                </IonRow>
                <IonCardContent>
                  <p className="ion-padding-start ion-padding-end">
                    {profile.about ? profile.about : ''}
                  </p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </>
          :
          <IonCol>
            <IonCard className="speaker-card">
              <IonCardHeader>
                <IonCardTitle>
                  <IonSkeletonText animated style={{ width: '100%' }} />
                </IonCardTitle>
              </IonCardHeader>
              <IonSkeletonText animated style={{ width: '100%', height: '40vh' }} />
              <IonCardContent class="outer-content">
                <IonList lines="none">
                  <IonItem>
                    <IonSkeletonText animated />
                  </IonItem>
                  <IonItem>
                    <IonSkeletonText animated />
                  </IonItem>
                  <IonItem>
                    <IonSkeletonText animated />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
      }
      <>
        {
          showImage && (
            <Lightbox
              mainSrc={bigImage ? bigImage : ''}
              onCloseRequest={() => setShowImage(false)}
            />
          )
        }
      </>
    </>
  );
};

export default ProfileCard;