import React, { useState } from 'react';
import { Session } from '../models/Session';
import { Speaker } from '../models/Speaker';
import { IonCard, IonCardHeader, IonItem, IonAvatar, IonCardContent, IonList, IonRow, IonCol, IonButton, IonIcon, IonActionSheet, IonLabel } from '@ionic/react';
import { logoTwitter, shareAlt, chatboxes, calendar, body, pin, close, heart } from 'ionicons/icons';
import { ActionSheetButton } from '@ionic/core';
import { Profile } from '../models/Profile';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
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

  return (
    <>
      {
        profile?
        <>
        <IonCard className="speaker-card">
          <IonCardHeader>
            <IonItem detail={false} lines="none">
              <IonAvatar slot="start">
                <img src={profile.images.length > 0 ? profile.images[0].imageUrl: 'none'} alt="Pic" />
              </IonAvatar>
              {profile.firstName}
            </IonItem>
          </IonCardHeader>
  
          <IonCardContent class="outer-content">
            <IonList lines="none">
              <IonItem>
                <IonIcon icon={calendar} slot="start"></IonIcon>
                <IonLabel position="stacked">Age</IonLabel>
                <IonLabel position="stacked">
                  {calculateAge(profile.dob)}
                </IonLabel> 
              </IonItem>

              <IonItem>
                <IonIcon icon={body} slot="start"></IonIcon>
                <IonLabel position="stacked">Height</IonLabel>
                <IonLabel position="stacked">
                  {profile.height? profile.height : 'N/A'}
                </IonLabel> 
              </IonItem>

              <IonItem>
                <IonIcon icon={pin} slot="start"></IonIcon>
                <IonLabel position="stacked">Location</IonLabel>
                <IonLabel position="stacked">
                  D.C.
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
  
          <IonRow justify-content-center>
            <IonCol>
              <p className="ion-padding-start ion-padding-end">
                { profile.about? profile.about : ''}
              </p>
            </IonCol>
          </IonRow>
          <IonRow justify-content-center>
            <IonCol text-center size="6">
              <IonButton
                fill="clear"
                size="small"
                color="primary"
              >
                <IonIcon slot="start" icon={close} />
                Pass
            </IonButton>
            </IonCol>
            <IonCol text-center size="6">
              <IonButton 
                fill="clear" 
                size="small" 
                color="primary">
                <IonIcon slot="start" icon={heart} />
                Like
            </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
        </>
        :
        <></>
      }
    </>
  );
};

export default ProfileCard;