import { Card, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

export function LivenessVerification() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Liveness Verification</h1>
                    <p className="text-text-400 mt-1">Geo-fenced selfie verification for remote workers</p>
                </div>
                <Badge variant="success">Security Protocol Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col items-center justify-center p-12 border-dashed border-2 border-border-12 bg-bg-800/20">
                    <div className="w-64 h-64 rounded-full border-4 border-primary-500 flex items-center justify-center relative overflow-hidden bg-bg-900">
                        <div className="text-6xl grayscale opacity-50">👤</div>
                        <div className="absolute inset-0 border-2 border-primary-500/30 animate-pulse rounded-full"></div>
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary-500/50 animate-ping"></div>
                    </div>
                    <p className="text-text-400 mt-8 text-center max-w-xs">
                        Position your face within the circle and wait for the randomized instruction.
                    </p>
                    <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                        <p className="text-primary-400 font-bold text-center uppercase tracking-widest animate-pulse">
                            Look Left → Blink Twice
                        </p>
                    </div>
                    <Button variant="primary" className="mt-8 px-12">Capture Verification</Button>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-text-100 mb-4">Verification Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-400">Compliance Rate</span>
                                    <span className="text-sm font-bold text-success-400">99.2%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-400">Failed Attempts Today</span>
                                    <span className="text-sm font-bold text-error-400">2</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-400">Active Sessions</span>
                                    <span className="text-sm font-bold text-text-100">45</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-text-100 mb-4">Location Validation</h3>
                            <div className="h-48 bg-bg-800 rounded-lg flex items-center justify-center border border-border-12 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2048!3i2048!2m3!1e0!2sm!3i420120488!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] bg-cover"></div>
                                <div className="z-10 text-center">
                                    <span className="text-3xl">📍</span>
                                    <p className="text-xs text-text-100 font-bold mt-2">Current Location: Bangalore, IN</p>
                                    <p className="text-[10px] text-text-400">Accuracy: 5 meters (GPS)</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="success">Whitelisted IP</Badge>
                                <Badge variant="success">Verified GPS</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
