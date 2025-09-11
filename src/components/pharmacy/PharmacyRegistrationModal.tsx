import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, FileCheck, MapPin, Phone, Mail, Upload, Shield, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PharmacyRegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PharmacyRegistrationModal = ({ open, onOpenChange }: PharmacyRegistrationModalProps) => {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    licenseNumber: '',
    verificationDept: '',
    gstNumber: '',
    panNumber: '',
    bankAccount: '',
    ifscCode: '',
    operatingHours: '',
    specializations: [] as string[],
    acceptTerms: false
  })
  const [documents, setDocuments] = useState({
    pharmacyLicense: null as File | null,
    gstCertificate: null as File | null,
    panCard: null as File | null,
    addressProof: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const verificationDepartments = [
    "State Drug Control Department",
    "Central Drugs Standard Control Organization (CDSCO)",
    "Food and Drug Administration (FDA)",
    "State Pharmacy Council",
    "Ministry of Health and Family Welfare",
    "State Health Department",
    "District Collector Office",
    "Municipal Corporation Health Department"
  ]

  const specializationOptions = [
    "Ayurvedic Medicines",
    "Allopathic Medicines",
    "Homeopathic Medicines",
    "Herbal Supplements",
    "Generic Medicines",
    "Emergency Medicines",
    "Chronic Disease Management",
    "Pediatric Medicines",
    "Geriatric Care",
    "Women's Health"
  ]

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        specializations: [...prev.specializations, specialization] 
      }))
    } else {
      setFormData(prev => ({ 
        ...prev, 
        specializations: prev.specializations.filter(s => s !== specialization) 
      }))
    }
  }

  const handleFileUpload = (field: keyof typeof documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocuments(prev => ({ ...prev, [field]: file }))
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`
      })
    }
  }

  const submitRegistration = async () => {
    // Validation
    if (!formData.pharmacyName || !formData.ownerName || !formData.email || 
        !formData.phone || !formData.licenseNumber || !formData.verificationDept) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      })
      return
    }

    if (!documents.pharmacyLicense) {
      toast({
        title: "License Required",
        description: "Please upload your pharmacy license.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call for registration
      const registrationData = {
        ...formData,
        documents: Object.keys(documents).filter(key => documents[key as keyof typeof documents]),
        registrationDate: new Date().toISOString(),
        status: 'pending_verification',
        applicationId: `PHARM${Date.now()}`
      }

      // Save to localStorage for demo
      const existingApplications = JSON.parse(localStorage.getItem('pharmacyApplications') || '[]')
      existingApplications.push(registrationData)
      localStorage.setItem('pharmacyApplications', JSON.stringify(existingApplications))

      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay

      toast({
        title: "Registration Submitted!",
        description: `Application ID: ${registrationData.applicationId}. We'll verify your documents and contact you within 3-5 business days.`
      })

      onOpenChange(false)
      
      // Reset form
      setFormData({
        pharmacyName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        licenseNumber: '',
        verificationDept: '',
        gstNumber: '',
        panNumber: '',
        bankAccount: '',
        ifscCode: '',
        operatingHours: '',
        specializations: [],
        acceptTerms: false
      })
      setDocuments({
        pharmacyLicense: null,
        gstCertificate: null,
        panCard: null,
        addressProof: null
      })

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[700px] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Pharmacy Registration
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic-info" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="flex-1 overflow-y-auto">
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Pharmacy Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-name">Pharmacy Name *</Label>
                    <Input
                      id="pharmacy-name"
                      placeholder="e.g., MediCare Pharmacy"
                      value={formData.pharmacyName}
                      onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Owner Name *</Label>
                    <Input
                      id="owner-name"
                      placeholder="Full name of pharmacy owner"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="pharmacy@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Contact number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address including street, landmark"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City name"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="State name"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operating-hours">Operating Hours</Label>
                  <Input
                    id="operating-hours"
                    placeholder="e.g., 9:00 AM - 10:00 PM"
                    value={formData.operatingHours}
                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                  />
                </div>
              </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="flex-1 overflow-y-auto">
            <div className="h-full pb-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Government Verification
                  </CardTitle>
                  <CardDescription>
                    Provide your license details and verification department information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  <Label htmlFor="license-number">Pharmacy License Number *</Label>
                  <Input
                    id="license-number"
                    placeholder="Enter your pharmacy license number"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Verification Department *</Label>
                  <Select 
                    value={formData.verificationDept}
                    onValueChange={(value) => handleInputChange('verificationDept', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the government department that issued your license" />
                    </SelectTrigger>
                    <SelectContent>
                      {verificationDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gst-number">GST Number</Label>
                    <Input
                      id="gst-number"
                      placeholder="GST registration number"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan-number">PAN Number</Label>
                    <Input
                      id="pan-number"
                      placeholder="PAN card number"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Account Number</Label>
                    <Input
                      id="bank-account"
                      placeholder="For payment settlements"
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                    <Input
                      id="ifsc-code"
                      placeholder="Bank IFSC code"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {specializationOptions.map((specialization) => (
                      <div key={specialization} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialization}
                          checked={formData.specializations.includes(specialization)}
                          onCheckedChange={(checked) => 
                            handleSpecializationChange(specialization, checked as boolean)
                          }
                        />
                        <Label htmlFor={specialization} className="text-sm cursor-pointer">
                          {specialization}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="flex-1 overflow-y-auto">
            <div className="h-full pb-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Document Upload
                  </CardTitle>
                  <CardDescription>
                    Upload required documents for verification (PDF, JPG, PNG accepted)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-license">Pharmacy License * (Required)</Label>
                    <Input
                      id="pharmacy-license"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload('pharmacyLicense')}
                    />
                    {documents.pharmacyLicense && (
                      <Badge variant="secondary" className="w-fit">
                        <FileCheck className="h-3 w-3 mr-1" />
                        {documents.pharmacyLicense.name}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst-certificate">GST Certificate</Label>
                    <Input
                      id="gst-certificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload('gstCertificate')}
                    />
                    {documents.gstCertificate && (
                      <Badge variant="secondary" className="w-fit">
                        <FileCheck className="h-3 w-3 mr-1" />
                        {documents.gstCertificate.name}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pan-card">PAN Card</Label>
                    <Input
                      id="pan-card"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload('panCard')}
                    />
                    {documents.panCard && (
                      <Badge variant="secondary" className="w-fit">
                        <FileCheck className="h-3 w-3 mr-1" />
                        {documents.panCard.name}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address-proof">Address Proof</Label>
                    <Input
                      id="address-proof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload('addressProof')}
                    />
                    {documents.addressProof && (
                      <Badge variant="secondary" className="w-fit">
                        <FileCheck className="h-3 w-3 mr-1" />
                        {documents.addressProof.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Document Guidelines:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All documents should be clear and readable</li>
                    <li>• File size should not exceed 5MB per document</li>
                    <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>• Documents will be verified within 3-5 business days</li>
                  </ul>
                </div>
              </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="review" className="flex-1 overflow-y-auto">
            <div className="h-full pb-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                  <CardDescription>
                    Please review your information before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Pharmacy Name</Label>
                    <p className="text-sm">{formData.pharmacyName || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Owner Name</Label>
                    <p className="text-sm">{formData.ownerName || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{formData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm">{formData.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">License Number</Label>
                    <p className="text-sm">{formData.licenseNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Verification Department</Label>
                    <p className="text-sm">{formData.verificationDept || 'Not selected'}</p>
                  </div>
                </div>

                {formData.specializations.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Specializations</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Uploaded Documents</Label>
                  <div className="space-y-1 mt-1">
                    {Object.entries(documents).map(([key, file]) => (
                      file && (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <FileCheck className="h-4 w-4 text-success" />
                          <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accept-terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                  />
                  <Label htmlFor="accept-terms" className="text-sm cursor-pointer">
                    I accept the terms and conditions and confirm that all information provided is accurate
                  </Label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">What happens next?</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. Your application will be reviewed by our verification team</li>
                    <li>2. We'll verify your documents with the respective government department</li>
                    <li>3. You'll receive approval notification within 3-5 business days</li>
                    <li>4. Once approved, patients can directly purchase medicines from your pharmacy</li>
                  </ul>
                </div>
              </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submitRegistration} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}