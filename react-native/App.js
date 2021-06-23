import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { connectActionSheet, ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as Notifications from "expo-notifications";
// context
import { UserContext, AppContext, LanguageContext, IAPContext } from "./Context";
// DAL
import DAL from "./DAL";
// hooks
import { useAuth, useLanguages, useStaticData, useStaticContent, useIap } from "./hooks";
// libs
import { errorHandler, getLanguageCode } from "./libs";
import { notificationsRef } from "./libs/firebase";
import NotificationHandler from "./libs/NotificationHandler";
import Language from "./libs/Language";
// screens
import ErrorBoundary from "react-native-error-boundary";
import Fallback from "./Fallback";
import Navigation from "./Navigation";
import Loading from "./Loading";

const App = () => {
	// useRef
	const notificationListener = useRef();
	const responseListener = useRef();

	// useAuth
	const { userLoaded, auth, currentUser, setCurrentUser, signOut } = useAuth();

	// useLanguages
	const { languages, nativeLanguages } = useLanguages();

	// useStaticData
	const { interests, categories } = useStaticData();

	// useStaticContent
	const { getContent, updateStaticContentByLanguage } = useStaticContent();

	// useIap
	const {} = useIap();

	// useContext
	const { processing, getProducts: getProductsFromContext, setProcessing } = useContext(IAPContext);

	// useState
	const [primaryLanguage, setPrimaryLanguage] = useState("");
	const [languageCode, setLanguageCode] = useState("");
	const [unseenNotifications, setUnseenNotifications] = useState(0);
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notifListener, setNotificationListener] = useState(false);

	// methods
	const updateUnseenNotifications = async (unreadNotifs = 0) => {
		try {
			let newCount = unreadNotifs;
			if (!newCount) newCount = (await axios.get("/unseenNotifsCount")) || 0;

			setUnseenNotifications(newCount);
			await Notifications.setBadgeCountAsync(newCount);
		} catch (err) {
			console.error(err);
			// errorHandler(err);
		}
	};

	const currentUserLanguageOnChangeHandler = async () => {
		try {
			const lang = currentUser.primaryLanguage;
			await Language.update(lang);

			setPrimaryLanguage(lang);
			updateStaticContentByLanguage(lang);

			setLanguageCode(getLanguageCode(lang));
		} catch (err) {
			console.error(err);
			// errorHandler(err);
		}
	};

	// useEffect
	useEffect(() => {
		(async () => {
			try {
				setPrimaryLanguage(await Language.get());
				setExpoPushToken(await NotificationHandler.registerForPushNotificationsAsync());

				// This listener is fired whenever a notification is received while the app is foregrounded
				notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
					setNotificationListener(notification);
				});

				// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
				responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
					// console.log(response);
				});

				return () => {
					Notifications.removeNotificationSubscription(notificationListener);
					Notifications.removeNotificationSubscription(responseListener);
				};
			} catch (err) {
				console.error(err);
				// errorHandler(err);
			}
		})();
	}, []);

	useEffect(() => {
		if (currentUser) {
			currentUserLanguageOnChangeHandler();
			updateUnseenNotifications();
		}
	}, [currentUser]);

	useEffect(() => {
		if (currentUser && languageCode) {
			const unsub = notificationsRef
				.where("userId", "==", currentUser.id)
				.where("notified", "==", false)
				.where("seen", "==", false)
				.orderBy("createdAt", "desc")
				.onSnapshot(async (snapshot) => {
					if (snapshot.empty) {
						return;
					}
					for (const change of snapshot.docChanges()) {
						if (change.type === "added") {
							try {
								const notification = { id: change.doc.id, ...change.doc.data() };
								const displayTitle = notification.content[languageCode];
								if (displayTitle) {
									await NotificationHandler.push(expoPushToken, displayTitle);
									await DAL.Notification.updateNotificationById(notification.id, { notified: true });
									await updateUnseenNotifications();
								}
							} catch (err) {
								console.error(err);
								// errorHandler(err);
							}
						}
					}
				});

			return () => unsub();
		}
	}, [currentUser, languageCode]);

	if (!userLoaded) return <Loading />;

	return (
		<ErrorBoundary FallbackComponent={Fallback}>
			<AppContext.Provider
				value={{
					interests,
					categories,
					unseenNotifications,
					expoPushToken,
					setUnseenNotifications,
					updateUnseenNotifications,
					updateStaticContentByLanguage,
					getContent,
				}}
			>
				<UserContext.Provider
					value={{
						auth,
						currentUser,
						expoPushToken,
						primaryLanguage,
						languageCode,
						setCurrentUser,
						signOut,
					}}
				>
					<LanguageContext.Provider value={{ languages, nativeLanguages }}>
						<IAPContext.Provider
							value={{
								processing: processing,
								setProcessing: setProcessing,
								getProducts: getProductsFromContext,
							}}
						>
							<ActionSheetProvider>
								<Navigation />
							</ActionSheetProvider>
						</IAPContext.Provider>
					</LanguageContext.Provider>
				</UserContext.Provider>
			</AppContext.Provider>
		</ErrorBoundary>
	);
};

export default connectActionSheet(App);